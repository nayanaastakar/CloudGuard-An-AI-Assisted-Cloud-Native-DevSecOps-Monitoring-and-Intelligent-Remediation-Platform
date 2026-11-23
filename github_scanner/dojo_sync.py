"""
CloudGuard DefectDojo Findings & Test Integration
Synchronizes scan results directly into DefectDojo ORM objects:
  Product -> Engagement -> Test -> Findings.
"""
from datetime import datetime, date
from typing import Dict, Any, List
from django.utils import timezone

class DefectDojoSync:
    """
    Directly creates and updates Product, Engagement, Test, and Finding records
    in DefectDojo's database according to standard models.
    """

    @classmethod
    def import_scan_findings(cls, repo_meta: Dict[str, Any], job_id: str, scan_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes raw scan results and creates verified DefectDojo records.
        """
        from dojo.models import (
            Product, Product_Type, Engagement, Test, Test_Type,
            Finding, Development_Environment, User
        )

        admin_user = User.objects.filter(is_superuser=True).first()
        prod_type, _ = Product_Type.objects.get_or_create(name="GitHub Repositories")
        
        # Product for this repository
        repo_name = repo_meta.get("full_name") or f"{repo_meta.get('owner')}/{repo_meta.get('repo')}"
        product, _ = Product.objects.get_or_create(
            name=f"GitHub: {repo_name}",
            defaults={
                "prod_type": prod_type,
                "description": repo_meta.get("description", "Imported GitHub Repository for security monitoring")
            }
        )

        # Engagement
        target_branch = repo_meta.get("target_branch") or repo_meta.get("default_branch", "main")
        engagement, _ = Engagement.objects.get_or_create(
            name=f"Branch: {target_branch}",
            product=product,
            defaults={
                "target_start": date.today(),
                "target_end": date.today(),
                "lead": admin_user,
                "status": "In Progress",
                "engagement_type": "CI/CD"
            }
        )

        # Test Type
        test_type, _ = Test_Type.objects.get_or_create(name="GitHub Multi-Scanner")
        dev_env, _ = Development_Environment.objects.get_or_create(name="Development")

        # Test run
        test = Test.objects.create(
            engagement=engagement,
            test_type=test_type,
            environment=dev_env,
            target_start=timezone.now(),
            target_end=timezone.now(),
            lead=admin_user,
            percent_complete=100
        )

        imported_count = 0
        duplicate_count = 0

        # Import individual findings
        for f in scan_results.get("findings", []):
            # Check for existing duplicate finding in product
            title = f"{f['title']} in {f['file_path']}:{f['line_number']}"
            existing = Finding.objects.filter(
                test__engagement__product=product,
                title=title
            ).first()

            if existing:
                duplicate_count += 1
                continue

            finding = Finding.objects.create(
                test=test,
                title=title,
                severity=f.get("severity", "Medium"),
                cwe=f.get("cwe") or 0,
                description=f"Scanner: {f['scanner']}\nFile: {f['file_path']}\nLine: {f['line_number']}\nRule ID: {f['rule_id']}\n\n{f['description']}\n\nMatched snippet:\n`{f['matched_content']}`",
                impact=f.get("impact", ""),
                mitigation=f.get("remediation", ""),
                file_path=f.get("file_path", ""),
                line=f.get("line_number", 1),
                component_name=f.get("scanner", "CloudGuard-Scanner"),
                component_version="v1.0",
                active=True,
                verified=True,
                false_p=False,
                duplicate=False,
                out_of_scope=False,
                risk_accepted=False,
                reporter=admin_user
            )
            imported_count += 1

        return {
            "product_id": product.id,
            "product_name": product.name,
            "engagement_id": engagement.id,
            "test_id": test.id,
            "imported_findings": imported_count,
            "duplicate_findings": duplicate_count
        }
