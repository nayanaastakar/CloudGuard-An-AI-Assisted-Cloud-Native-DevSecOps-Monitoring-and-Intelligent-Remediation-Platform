import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  PlayIcon,
  PlusIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CommandLineIcon,
  BeakerIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CubeTransparentIcon,
  CodeBracketIcon,
  Square3Stack3DIcon,
  LinkIcon,
  FolderIcon,
  BellIcon,
  ArrowPathIcon } from
'@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';
import usePipelineStore from '../../stores/pipelineStore';
import RepositorySelector, { RepositoryConfig } from './RepositorySelector';
import api from '../../services/api';
import { pipelineLogger as logger } from '../../utils/logger';

// Stage type definitions
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
























const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Available stage templates
const STAGE_TEMPLATES = [
{
  id: 'build',
  name: 'Build',
  icon: /*#__PURE__*/_jsxDEV(CommandLineIcon, { className: "h-5 w-5" }, void 0, false),
  type: 'build',
  description: 'Compile and build your application',
  defaultConfig: {
    image: 'node:18-alpine',
    commands: ['npm install', 'npm run build'],
    artifacts: ['dist/*'],
    timeout: 10
  }
},
{
  id: 'test',
  name: 'Test',
  icon: /*#__PURE__*/_jsxDEV(BeakerIcon, { className: "h-5 w-5" }, void 0, false),
  type: 'test',
  description: 'Run unit and integration tests',
  defaultConfig: {
    image: 'node:18-alpine',
    commands: ['npm test'],
    timeout: 15
  }
},
{
  id: 'deploy',
  name: 'Deploy',
  icon: /*#__PURE__*/_jsxDEV(RocketLaunchIcon, { className: "h-5 w-5" }, void 0, false),
  type: 'deploy',
  description: 'Deploy to production or staging',
  defaultConfig: {
    image: 'alpine:latest',
    commands: ['echo "Deploying..."'],
    timeout: 20
  }
},
{
  id: 'approval',
  name: 'Approval',
  icon: /*#__PURE__*/_jsxDEV(ShieldCheckIcon, { className: "h-5 w-5" }, void 0, false),
  type: 'approval',
  description: 'Manual approval gate',
  defaultConfig: {
    commands: [],
    timeout: 60
  }
},
{
  id: 'notify',
  name: 'Slack Notify',
  icon: /*#__PURE__*/_jsxDEV(ChatBubbleLeftRightIcon, { className: "h-5 w-5" }, void 0, false),
  type: 'notify',
  description: 'Send notifications via Slack',
  defaultConfig: {
    commands: ['echo "Sending notification..."'],
    timeout: 5
  }
}];


const DEFAULT_YAML = `apiVersion: kubesight.io/v1
kind: Pipeline
metadata:
  name: my-pipeline
  description: "My pipeline description"
spec:
  stages:
    - name: Build
      steps:
        - name: "Install dependencies"
          command: "npm install"
        - name: "Build application"
          command: "npm run build"

    - name: Test
      steps:
        - name: "Run tests"
          command: "npm test"

    - name: Deploy
      requiresApproval: true
      steps:
        - name: "Deploy to production"
          command: "npm run deploy"
`;

const TEMPLATES = [
{
  name: 'Node.js',
  icon: '📦',
  yaml: DEFAULT_YAML
},
{
  name: 'Docker',
  icon: '🐳',
  yaml: `apiVersion: kubesight.io/v1
kind: Pipeline
metadata:
  name: docker-pipeline
  description: "Build and push Docker image"
spec:
  stages:
    - name: Build
      steps:
        - name: "Build image"
          command: "docker build -t myapp:latest ."
    - name: Push
      steps:
        - name: "Push to registry"
          command: "docker push myapp:latest"`
},
{
  name: 'Kubernetes',
  icon: '☸️',
  yaml: `apiVersion: kubesight.io/v1
kind: Pipeline
metadata:
  name: k8s-deploy
  description: "Deploy to Kubernetes"
spec:
  stages:
    - name: Deploy
      requiresApproval: true
      steps:
        - name: "Apply manifests"
          command: "kubectl apply -f k8s/"`
}];


const getStageGradient = (type) => {
  switch (type) {
    case 'build':
      return 'from-blue-500 to-indigo-600';
    case 'test':
      return 'from-purple-500 to-violet-600';
    case 'deploy':
      return 'from-emerald-500 to-green-600';
    case 'approval':
      return 'from-amber-500 to-yellow-600';
    case 'notify':
      return 'from-pink-500 to-rose-600';
    default:
      return 'from-gray-500 to-slate-600';
  }
};

const getStageBgColor = (type) => {
  switch (type) {
    case 'build':
      return 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30';
    case 'test':
      return 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30';
    case 'deploy':
      return 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30';
    case 'approval':
      return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30';
    case 'notify':
      return 'bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/30';
    default:
      return 'bg-gray-50 dark:bg-gray-500/10 border-gray-200 dark:border-gray-500/30';
  }
};

export default function PipelineEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPipeline, fetchPipelineById, createPipeline, updatePipelineYaml, triggerPipeline } = usePipelineStore();

  // View mode: 'visual' or 'yaml'
  const [viewMode, setViewMode] = useState('visual');

  // Pipeline metadata
  const [pipelineName, setPipelineName] = useState('my-pipeline');
  const [pipelineDescription, setPipelineDescription] = useState('');
  const [executionMode, setExecutionMode] = useState('local');

  // Pipeline stages for visual editor
  const [stages, setStages] = useState([
  { id: '1', name: 'Build', type: 'build', image: 'node:18-alpine', commands: ['npm install', 'npm run build'], artifacts: ['dist/*'], timeout: 10, retries: 1 },
  { id: '2', name: 'Test', type: 'test', image: 'node:18-alpine', commands: ['npm test'], timeout: 15, retries: 1 },
  { id: '3', name: 'Deploy', type: 'deploy', image: 'alpine:latest', commands: ['npm run deploy'], timeout: 20, retries: 0 }]
  );

  // Selected stage for right panel
  const [selectedStage, setSelectedStage] = useState(null);

  // YAML content
  const [yaml, setYaml] = useState(DEFAULT_YAML);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draggedStage, setDraggedStage] = useState(null);

  // Repository connection state
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [repoConfig, setRepoConfig] = useState(null);

  // AI assistant state
  const [aiDescription, setAiDescription] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const isInitialLoadRef = useRef(true);

  // Prevent accidental navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Canvas ref for drag and drop
  const canvasRef = useRef(null);

  const isEditMode = Boolean(id);

  // Handle duplicate from location state
  useEffect(() => {
    if (location.state?.duplicate) {
      const dup = location.state.duplicate;
      if (dup.yaml) {
        setYaml(dup.yaml);
        parseYamlToStages(dup.yaml);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (isEditMode && id) {
      fetchPipelineById(id);
    }
  }, [id, isEditMode, fetchPipelineById]);

  useEffect(() => {
    if (isEditMode && selectedPipeline) {
      if (selectedPipeline.yaml) {
        setYaml(selectedPipeline.yaml);
        parseYamlToStages(selectedPipeline.yaml);
      }
      if (selectedPipeline.name) {
        setPipelineName(selectedPipeline.name);
      }
      if (selectedPipeline.description) {
        setPipelineDescription(selectedPipeline.description);
      }
      if (selectedPipeline.execution_mode || selectedPipeline.executionMode) {
        setExecutionMode(selectedPipeline.execution_mode || selectedPipeline.executionMode);
      }
      // Mark initial load as complete after pipeline data is loaded
      setTimeout(() => {isInitialLoadRef.current = false;}, 100);
    } else if (!isEditMode) {
      // For new pipelines, mark initial load as complete after a short delay
      setTimeout(() => {isInitialLoadRef.current = false;}, 100);
    }
  }, [isEditMode, selectedPipeline]);

  // Parse YAML to visual stages
  const parseYamlToStages = (yamlContent) => {
    try {
      const stagesMatch = yamlContent.match(/stages:\s*\n([\s\S]*?)(?=\n[a-z]|\n$|$)/i);
      if (stagesMatch) {
        const stagesText = stagesMatch[1];
        const stageBlocks = stagesText.split(/(?=\s*- name:)/);

        const parsedStages = stageBlocks.
        filter((block) => block.includes('- name:')).
        map((block, index) => {
          const nameMatch = block.match(/- name:\s*["']?([^"'\n]+)["']?/);
          const commandMatches = block.match(/command:\s*["']?([^"'\n]+)["']?/g);

          const name = nameMatch?.[1]?.trim() || `Stage ${index + 1}`;
          const commands = commandMatches?.map((c) =>
          c.replace(/command:\s*["']?([^"'\n]+)["']?/, '$1').trim()
          ) || [];

          // Determine type based on name
          let type = 'custom';
          if (name.toLowerCase().includes('build')) type = 'build';else
          if (name.toLowerCase().includes('test')) type = 'test';else
          if (name.toLowerCase().includes('deploy')) type = 'deploy';else
          if (name.toLowerCase().includes('approv')) type = 'approval';else
          if (name.toLowerCase().includes('notify') || name.toLowerCase().includes('slack')) type = 'notify';

          return {
            id: `stage-${index}`,
            name,
            type,
            image: 'node:18-alpine',
            commands,
            timeout: 10,
            retries: 1
          };
        });

        if (parsedStages.length > 0) {
          setStages(parsedStages);
        }
      }
    } catch (e) {
      logger.error('Failed to parse YAML', e);
    }
  };

  // Convert stages to YAML
  const stagesToYaml = useCallback(() => {
    const stagesYaml = stages.map((stage) => {
      const steps = stage.commands.map((cmd) => `        - name: "Run ${cmd.split(' ')[0]}"\n          command: "${cmd}"`).join('\n');
      const approvalConfig = stage.requiresApproval || stage.type === 'approval' ?
      `      requiresApproval: true\n      ${stage.requiredApprovers && stage.requiredApprovers > 1 ? `requiredApprovers: ${stage.requiredApprovers}\n      ` : ''}` :
      '';
      return `    - name: ${stage.name}
${approvalConfig}      steps:
${steps}`;
    }).join('\n\n');

    return `apiVersion: kubesight.io/v1
kind: Pipeline
metadata:
  name: ${stages[0]?.name?.toLowerCase().replace(/\s+/g, '-') || 'my-pipeline'}
  description: "Pipeline created with visual editor"
spec:
  stages:
${stagesYaml}
`;
  }, [stages]);

  // Sync YAML when stages change (in visual mode)
  useEffect(() => {
    if (viewMode === 'visual') {
      const newYaml = stagesToYaml();
      setYaml(newYaml);
      // Only mark as unsaved after initial load is complete
      if (!isInitialLoadRef.current) {
        setHasUnsavedChanges(true);
      }
    }
  }, [stages, viewMode, stagesToYaml]);

  const extractMetadata = () => {
    const nameMatch = yaml.match(/name:\s*(.+)/);
    const descMatch = yaml.match(/description:\s*"?(.+?)"?\s*$/m);
    return {
      name: nameMatch?.[1]?.trim() || 'my-pipeline',
      description: descMatch?.[1]?.trim() || ''
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    setAiError(null);
    try {
      if (isEditMode && id) {
        await updatePipelineYaml(id, yaml);
        setHasUnsavedChanges(false);
        navigate(`/pipelines/${id}`);
      } else {
        const pipelineData = {
          name: pipelineName || 'my-pipeline',
          description: pipelineDescription,
          yaml,
          execution_mode: executionMode
        };
        // Include repository config if connected
        if (repoConfig) {
          pipelineData.repository = repoConfig.repository;
          pipelineData.branch = repoConfig.branch;
          pipelineData.provider = repoConfig.provider;
        }
        const newPipeline = await createPipeline(pipelineData);
        setHasUnsavedChanges(false);
        navigate(`/pipelines/${newPipeline.id}`);
      }
    } catch (error) {
      logger.error('Failed to save pipeline', error);
      setAiError(error.response?.data?.detail || error.message || 'Failed to save pipeline. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle repository selection
  const handleRepoSelect = (config) => {
    setRepoConfig(config);
  };

  const handleRun = async () => {
    if (!id) {
      // Save first then run
      const { name, description } = extractMetadata();
      try {
        const newPipeline = await createPipeline({ name, description, yaml });
        const run = await triggerPipeline(newPipeline.id);
        navigate(`/pipelines/${newPipeline.id}/runs/${run.id}`);
      } catch (error) {
        logger.error('Failed to save and run', error);
      }
    } else {
      try {
        await updatePipelineYaml(id, yaml);
        const run = await triggerPipeline(id);
        navigate(`/pipelines/${id}/runs/${run.id}`);
      } catch (error) {
        logger.error('Failed to run pipeline', error);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Generation handlers
  const handleAIGenerate = async () => {
    if (!aiDescription.trim()) {
      setAiError('Please enter a description of your pipeline');
      return;
    }

    setIsGeneratingAI(true);
    setAiError(null);

    try {
      const response = await api.post('/pipelines/ai/generate', {
        description: aiDescription,
        deployment_target: 'Kubernetes'
      });

      if (response.data.yaml) {
        setYaml(response.data.yaml);
        parseYamlToStages(response.data.yaml);
        setHasUnsavedChanges(true);
      }
    } catch (error) {
      logger.error('AI generation failed', error);
      setAiError(error.response?.data?.detail || 'Failed to generate pipeline. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAIOptimize = async () => {
    setIsGeneratingAI(true);
    setAiError(null);

    try {
      const response = await api.post('/pipelines/ai/optimize', {
        pipeline_yaml: yaml
      });

      if (response.data.recommendations) {
        setAiRecommendations(response.data.recommendations);
        setShowRecommendationsModal(true);
      }
    } catch (error) {
      logger.error('AI optimization failed', error);
      setAiError(error.response?.data?.detail || 'Failed to analyze pipeline');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddCommonStages = () => {
    // Add common stages (build, test, deploy) if not present
    const existingTypes = stages.map((s) => s.type);
    const newStages = [];

    if (!existingTypes.includes('build')) {
      newStages.push({
        id: `stage-${Date.now()}-build`,
        name: 'Build',
        type: 'build',
        image: 'node:18-alpine',
        commands: ['npm install', 'npm run build'],
        artifacts: ['dist/*'],
        timeout: 10,
        retries: 1
      });
    }

    if (!existingTypes.includes('test')) {
      newStages.push({
        id: `stage-${Date.now()}-test`,
        name: 'Test',
        type: 'test',
        image: 'node:18-alpine',
        commands: ['npm test'],
        timeout: 15,
        retries: 1
      });
    }

    if (!existingTypes.includes('deploy')) {
      newStages.push({
        id: `stage-${Date.now()}-deploy`,
        name: 'Deploy',
        type: 'deploy',
        image: 'alpine:latest',
        commands: ['echo "Deploying..."'],
        timeout: 20,
        retries: 0
      });
    }

    if (newStages.length > 0) {
      setStages([...stages, ...newStages]);
      setHasUnsavedChanges(true);
    } else {
      setAiError('All common stages (build, test, deploy) are already present');
      setTimeout(() => setAiError(null), 3000);
    }
  };

  // Mode switch handler with unsaved changes warning
  const handleModeSwitch = (newMode) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Switching modes may cause some formatting changes. Continue?');
      if (!confirmed) return;
    }

    if (newMode === 'visual' && viewMode === 'yaml') {
      // Parse YAML to stages when switching to visual
      parseYamlToStages(yaml);
    }

    setViewMode(newMode);
  };

  const handleTemplateSelect = (template) => {
    setYaml(template.yaml);
    parseYamlToStages(template.yaml);
    setShowTemplates(false);
  };

  // Drag and drop handlers
  const handleDragStart = (templateId) => {
    setDraggedStage(templateId);
  };

  const handleDragEnd = () => {
    setDraggedStage(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedStage) return;

    const template = STAGE_TEMPLATES.find((t) => t.id === draggedStage);
    if (template) {
      const newStage = {
        id: `stage-${Date.now()}`,
        name: template.name,
        type: template.type,
        image: template.defaultConfig.image || 'alpine:latest',
        commands: template.defaultConfig.commands || [],
        artifacts: template.defaultConfig.artifacts,
        timeout: template.defaultConfig.timeout || 10,
        retries: 1
      };
      setStages([...stages, newStage]);
      setSelectedStage(newStage);
    }
    setDraggedStage(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Stage management
  const addStageFromTemplate = (template) => {
    const newStage = {
      id: `stage-${Date.now()}`,
      name: template.name,
      type: template.type,
      image: template.defaultConfig.image || 'alpine:latest',
      commands: template.defaultConfig.commands || [],
      artifacts: template.defaultConfig.artifacts,
      timeout: template.defaultConfig.timeout || 10,
      retries: 1
    };
    setStages([...stages, newStage]);
    setSelectedStage(newStage);
    setHasUnsavedChanges(true);
  };

  const removeStage = (stageId) => {
    setStages(stages.filter((s) => s.id !== stageId));
    if (selectedStage?.id === stageId) {
      setSelectedStage(null);
    }
    setHasUnsavedChanges(true);
  };

  const updateStage = (updatedStage) => {
    setStages(stages.map((s) => s.id === updatedStage.id ? updatedStage : s));
    setSelectedStage(updatedStage);
    setHasUnsavedChanges(true);
  };

  const getStageIcon = (type) => {
    switch (type) {
      case 'build':
        return /*#__PURE__*/_jsxDEV(CommandLineIcon, { className: "h-5 w-5" }, void 0, false);
      case 'test':
        return /*#__PURE__*/_jsxDEV(BeakerIcon, { className: "h-5 w-5" }, void 0, false);
      case 'deploy':
        return /*#__PURE__*/_jsxDEV(RocketLaunchIcon, { className: "h-5 w-5" }, void 0, false);
      case 'approval':
        return /*#__PURE__*/_jsxDEV(ShieldCheckIcon, { className: "h-5 w-5" }, void 0, false);
      case 'notify':
        return /*#__PURE__*/_jsxDEV(ChatBubbleLeftRightIcon, { className: "h-5 w-5" }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV(Cog6ToothIcon, { className: "h-5 w-5" }, void 0, false);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "h-full w-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "sticky top-0 z-30 flex-shrink-0 backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 border-b border-gray-200/50 dark:border-slate-700/50 px-6 py-4 shadow-lg shadow-black/5", children: /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 }, children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: () => {
                  if (hasUnsavedChanges) {
                    const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
                    if (!confirmed) return;
                  }
                  navigate('/pipelines');
                },
                className: "p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors", children: /*#__PURE__*/

                _jsxDEV(ArrowLeftIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-300" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h1", { className: "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(CubeTransparentIcon, { className: "h-6 w-6 text-blue-500" }, void 0, false),
                  isEditMode ? `Editing: ${selectedPipeline?.name || 'Pipeline'}` : 'New Pipeline',
                  hasUnsavedChanges && /*#__PURE__*/
                  _jsxDEV("span", { className: "ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full", children: "Unsaved" }, void 0, false

                  )] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5", children:
                  viewMode === 'visual' ? 'Visual pipeline builder' : 'YAML configuration' }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-3", children: [

              aiError && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { opacity: 0, x: 10 },
                animate: { opacity: 1, x: 0 },
                className: "px-3 py-1.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-xs text-red-700 dark:text-red-400 max-w-xs truncate", children:

                aiError }, void 0, false
              ), /*#__PURE__*/



              _jsxDEV("div", { className: "flex items-center backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 rounded-xl p-1 border border-white/20 dark:border-slate-600/50", children: [/*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: () => handleModeSwitch('visual'),
                  className: `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  viewMode === 'visual' ?
                  'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' :
                  'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-600/50'}`, children: [/*#__PURE__*/


                  _jsxDEV(Square3Stack3DIcon, { className: "h-4 w-4" }, void 0, false), "Visual"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: () => handleModeSwitch('yaml'),
                  className: `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  viewMode === 'yaml' ?
                  'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' :
                  'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-600/50'}`, children: [/*#__PURE__*/


                  _jsxDEV(CodeBracketIcon, { className: "h-4 w-4" }, void 0, false), "YAML"] }, void 0, true

                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: handleSave,
                disabled: isSaving,
                className: "px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25", children:

                isSaving ? /*#__PURE__*/
                _jsxDEV("span", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Saving..."] }, void 0, true

                ) :

                'Save Pipeline' }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: handleRun,
                className: "flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/25", children: [/*#__PURE__*/

                _jsxDEV(PlayIcon, { className: "h-4 w-4" }, void 0, false), "Run"] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-1 min-h-0 grid grid-cols-[288px_1fr_320px] overflow-hidden", children:
        viewMode === 'visual' ? /*#__PURE__*/
        _jsxDEV(_Fragment, { children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex flex-col min-h-0 overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-r border-gray-200/50 dark:border-slate-700/50 shadow-sm", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex-1 min-h-0 overflow-y-auto p-5 code-scrollbar", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "mb-6 space-y-4", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(RocketLaunchIcon, { className: "h-5 w-5 text-blue-500" }, void 0, false), "Pipeline Name"] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: pipelineName,
                    onChange: (e) => {
                      setPipelineName(e.target.value);
                      setHasUnsavedChanges(true);
                    },
                    placeholder: "my-pipeline",
                    className: "w-full px-3 py-2.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5", children: "Description (optional)" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("textarea", {
                    value: pipelineDescription,
                    onChange: (e) => {
                      setPipelineDescription(e.target.value);
                      setHasUnsavedChanges(true);
                    },
                    placeholder: "Pipeline description...",
                    rows: 2,
                    className: "w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none shadow-sm" }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5", children: "Execution Mode" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("select", {
                    value: executionMode,
                    onChange: (e) => {
                      setExecutionMode(e.target.value);
                      setHasUnsavedChanges(true);
                    },
                    className: "w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm", children: [/*#__PURE__*/

                    _jsxDEV("option", { value: "local", children: "Local (Backend Server)" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "kubernetes", children: "Kubernetes Pod" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "agent", children: "Remote Agent" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "mt-1 text-xs text-gray-400 dark:text-gray-500", children: [
                    executionMode === 'local' && 'Commands run on the backend server',
                    executionMode === 'kubernetes' && 'Each stage runs in a K8s pod',
                    executionMode === 'agent' && 'Runs on a registered remote agent'] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "mb-6 border-t border-gray-200 dark:border-slate-700 pt-5", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(FolderIcon, { className: "h-5 w-5 text-purple-500" }, void 0, false), "Repository"] }, void 0, true

                ),
                repoConfig ? /*#__PURE__*/
                _jsxDEV(motion.div, {
                  initial: { opacity: 0, y: -10 },
                  animate: { opacity: 1, y: 0 },
                  className: "p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 border border-purple-200 dark:border-purple-500/30 rounded-lg shadow-sm", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-1.5 rounded-lg bg-purple-500/20", children: /*#__PURE__*/
                      _jsxDEV(LinkIcon, { className: "h-4 w-4 text-purple-500" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs font-semibold text-gray-900 dark:text-white truncate flex-1", children:
                      repoConfig.repoFullName || repoConfig.repository.split('/').slice(-2).join('/') }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-md font-mono", children:
                      repoConfig.branch }, void 0, false
                    ),
                    repoConfig.webhookEnabled && /*#__PURE__*/
                    _jsxDEV("span", { className: "flex items-center gap-1 text-emerald-600 dark:text-emerald-400", children: [/*#__PURE__*/
                      _jsxDEV(BellIcon, { className: "h-3 w-3" }, void 0, false), "Auto-trigger"] }, void 0, true

                    )] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: () => setShowRepoSelector(true),
                    className: "mt-2 w-full text-xs text-purple-600 dark:text-purple-400 hover:underline", children:
                    "Change repository" }, void 0, false

                  )] }, void 0, true
                ) : /*#__PURE__*/

                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02, y: -2 },
                  whileTap: { scale: 0.98 },
                  onClick: () => setShowRepoSelector(true),
                  className: "w-full p-3 flex items-center gap-3 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border-2 border-dashed border-purple-300 dark:border-purple-500/50 hover:border-purple-500 rounded-lg transition-all shadow-sm hover:shadow-md", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white", children: /*#__PURE__*/
                    _jsxDEV(LinkIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "text-left", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Connect Repository" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Link GitHub, GitLab, or Bitbucket" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true

              ), /*#__PURE__*/

              _jsxDEV("div", { className: "border-t border-gray-200 dark:border-slate-700 pt-5", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(Square3Stack3DIcon, { className: "h-5 w-5 text-blue-500" }, void 0, false), "Stages Library"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-5", children: "Drag and drop stages to the canvas or click to add" }, void 0, false

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(motion.div, {
                variants: containerVariants,
                initial: "hidden",
                animate: "visible",
                className: "space-y-3", children:

                STAGE_TEMPLATES.map((template) => /*#__PURE__*/
                _jsxDEV(motion.div, {

                  variants: itemVariants,
                  draggable: true,
                  onDragStart: () => handleDragStart(template.id),
                  onDragEnd: handleDragEnd,
                  onClick: () => addStageFromTemplate(template),
                  whileHover: { scale: 1.02, y: -2 },
                  whileTap: { scale: 0.98 },
                  className: `flex items-center gap-3 p-4 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-lg cursor-move transition-all shadow-sm hover:shadow-md ${
                  draggedStage === template.id ? 'opacity-50 scale-95' : ''}`, children: [/*#__PURE__*/


                  _jsxDEV("div", { className: `p-2.5 rounded-xl bg-gradient-to-br ${getStageGradient(template.type)} text-white shadow-lg`, children:
                    template.icon }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                    _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white", children:
                      template.name }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children:
                      template.description }, void 0, false
                    )] }, void 0, true
                  )] }, template.id, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex flex-col min-h-0 overflow-hidden bg-gradient-to-b from-gray-50/30 to-transparent dark:from-slate-900/30", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "sticky top-0 z-10 flex-shrink-0 px-6 py-3 border-b border-gray-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Pipeline Flow" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium", children: [
                      stages.length, " ", stages.length === 1 ? 'stage' : 'stages'] }, void 0, true
                    ),
                    stages.some((s) => s.type === 'approval') && /*#__PURE__*/
                    _jsxDEV("span", { className: "px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium flex items-center gap-1", children: [/*#__PURE__*/
                      _jsxDEV(ShieldCheckIcon, { className: "h-3 w-3" }, void 0, false), "Approval Gate"] }, void 0, true

                    )] }, void 0, true

                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                    _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5" }, void 0, false), "~",
                    stages.reduce((acc, s) => acc + (s.timeout || 10), 0), " min"] }, void 0, true
                  ) }, void 0, false
                )] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/


            _jsxDEV("div", {
              ref: canvasRef,
              className: "flex-1 min-h-0 overflow-y-auto overflow-x-hidden code-scrollbar bg-gradient-to-b from-gray-50/30 via-transparent to-transparent dark:from-slate-900/20",
              onDrop: handleDrop,
              onDragOver: handleDragOver, children:

              stages.length === 0 ? /*#__PURE__*/
              _jsxDEV("div", { className: "h-full flex items-center justify-center p-6", children: /*#__PURE__*/
                _jsxDEV(GlassCard, { padding: "lg", className: "text-center max-w-md p-10", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25", children: /*#__PURE__*/
                    _jsxDEV(PlusIcon, { className: "h-10 w-10 text-white" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-3", children: "Start building your pipeline" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Drag stages from the library on the left or click them to add to your pipeline" }, void 0, false

                  )] }, void 0, true
                ) }, void 0, false
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "p-6", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex flex-col items-center gap-0 max-w-2xl mx-auto", children: [/*#__PURE__*/
                  _jsxDEV(AnimatePresence, { mode: "popLayout", children:
                    stages.map((stage, index) => /*#__PURE__*/
                    _jsxDEV(motion.div, {

                      layout: true,
                      initial: { opacity: 0, scale: 0.8 },
                      animate: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0.8 },
                      className: "flex flex-col items-center w-full", children: [/*#__PURE__*/


                      _jsxDEV(motion.div, {
                        whileHover: { scale: 1.02 },
                        whileTap: { scale: 0.98 },
                        onClick: () => setSelectedStage(stage),
                        className: `group relative w-full bg-white dark:bg-slate-800 rounded-xl border-2 cursor-pointer transition-all shadow-md hover:shadow-lg overflow-hidden ${
                        selectedStage?.id === stage.id ?
                        'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800/50 shadow-lg shadow-blue-500/20' :
                        `${getStageBgColor(stage.type)} hover:shadow-lg`}`, children: [/*#__PURE__*/



                        _jsxDEV("div", { className: `absolute top-0 left-0 px-2.5 py-1 text-xs font-bold text-white bg-gradient-to-r ${getStageGradient(stage.type)} rounded-br-xl`, children:
                          index + 1 }, void 0, false
                        ), /*#__PURE__*/


                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.1 },
                          whileTap: { scale: 0.9 },
                          onClick: (e) => {
                            e.stopPropagation();
                            removeStage(stage.id);
                          },
                          className: "absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all",
                          style: { opacity: selectedStage?.id === stage.id ? 1 : undefined }, children: /*#__PURE__*/

                          _jsxDEV(XMarkIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                        ), /*#__PURE__*/

                        _jsxDEV("div", { className: "p-4 pt-6", children: /*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
                            _jsxDEV("div", { className: `p-3 rounded-xl bg-gradient-to-br ${getStageGradient(stage.type)} text-white shadow-md`, children:
                              getStageIcon(stage.type) }, void 0, false
                            ), /*#__PURE__*/
                            _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-base font-bold text-gray-900 dark:text-white truncate", children:
                                stage.name }, void 0, false
                              ), /*#__PURE__*/
                              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5", children:
                                stage.type }, void 0, false
                              )] }, void 0, true
                            ), /*#__PURE__*/

                            _jsxDEV("div", { className: "flex flex-col items-end gap-1 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                              _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                                _jsxDEV(CommandLineIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                                stage.commands.length, " commands"] }, void 0, true
                              ), /*#__PURE__*/
                              _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                                _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                                stage.timeout || 10, " min"] }, void 0, true
                              ),
                              stage.type === 'approval' && /*#__PURE__*/
                              _jsxDEV("span", { className: "flex items-center gap-1 text-amber-600 dark:text-amber-400", children: [/*#__PURE__*/
                                _jsxDEV(ShieldCheckIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Approval Gate"] }, void 0, true

                              )] }, void 0, true

                            )] }, void 0, true
                          ) }, void 0, false
                        )] }, void 0, true
                      ),


                      index < stages.length - 1 && /*#__PURE__*/
                      _jsxDEV(motion.div, {
                        initial: { opacity: 0, scaleY: 0 },
                        animate: { opacity: 1, scaleY: 1 },
                        className: "flex flex-col items-center py-1", children: [/*#__PURE__*/

                        _jsxDEV("div", { className: `w-0.5 h-6 bg-gradient-to-b ${getStageGradient(stages[index + 1].type)}` }, void 0, false), /*#__PURE__*/
                        _jsxDEV(ChevronRightIcon, { className: `h-5 w-5 rotate-90 -mt-1 ${
                          stages[index + 1].type === 'build' ? 'text-blue-500' :
                          stages[index + 1].type === 'test' ? 'text-purple-500' :
                          stages[index + 1].type === 'deploy' ? 'text-emerald-500' :
                          stages[index + 1].type === 'approval' ? 'text-amber-500' :
                          'text-gray-400'}` }, void 0, false
                        )] }, void 0, true
                      )] }, stage.id, true

                    )
                    ) }, void 0, false
                  ), /*#__PURE__*/


                  _jsxDEV(motion.div, {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    className: "flex flex-col items-center mt-2", children: [

                    stages.length > 0 && /*#__PURE__*/
                    _jsxDEV("div", { className: "w-0.5 h-4 bg-gray-300 dark:bg-slate-600 mb-2" }, void 0, false), /*#__PURE__*/

                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.03 },
                      whileTap: { scale: 0.97 },
                      onClick: () => setShowTemplates(!showTemplates),
                      className: "flex items-center justify-center gap-2 px-6 py-3 w-full border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all", children: [/*#__PURE__*/

                      _jsxDEV("div", { className: "p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700", children: /*#__PURE__*/
                        _jsxDEV(PlusIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-sm text-gray-500 dark:text-gray-400 font-medium", children: "Add Stage" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              ) }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV(motion.div, {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            className: "flex flex-col min-h-0 overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-l border-gray-200/50 dark:border-slate-700/50 shadow-sm", children: /*#__PURE__*/

            _jsxDEV("div", { className: "flex-1 min-h-0 overflow-y-auto code-scrollbar", children: /*#__PURE__*/
              _jsxDEV(AnimatePresence, { mode: "wait", children:
                selectedStage ? /*#__PURE__*/
                _jsxDEV(motion.div, {

                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                  className: "p-6", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                    _jsxDEV("h3", { className: "text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV(Cog6ToothIcon, { className: "h-5 w-5 text-blue-500" }, void 0, false), "Stage Settings"] }, void 0, true

                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      onClick: () => setSelectedStage(null),
                      className: "p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: /*#__PURE__*/

                      _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false) }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "space-y-5", children: [/*#__PURE__*/

                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Stage Name" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("input", {
                        type: "text",
                        value: selectedStage.name,
                        onChange: (e) => updateStage({ ...selectedStage, name: e.target.value }),
                        className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm" }, void 0, false
                      )] }, void 0, true
                    ), /*#__PURE__*/


                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Type" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("select", {
                        value: selectedStage.type,
                        onChange: (e) => updateStage({ ...selectedStage, type: e.target.value }),
                        className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm", children: [/*#__PURE__*/

                        _jsxDEV("option", { value: "build", children: "Build" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("option", { value: "test", children: "Test" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("option", { value: "deploy", children: "Deploy" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("option", { value: "approval", children: "Approval" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("option", { value: "notify", children: "Notify" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("option", { value: "custom", children: "Custom" }, void 0, false)] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/


                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Docker Image" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("input", {
                        type: "text",
                        value: selectedStage.image || '',
                        onChange: (e) => updateStage({ ...selectedStage, image: e.target.value }),
                        placeholder: "e.g., node:18-alpine",
                        className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-mono" }, void 0, false
                      )] }, void 0, true
                    ), /*#__PURE__*/


                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Commands" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("textarea", {
                        value: selectedStage.commands.join('\n'),
                        onChange: (e) => updateStage({ ...selectedStage, commands: e.target.value.split('\n').filter((c) => c.trim()) }),
                        placeholder: "npm install\nnpm run build",
                        rows: 4,
                        className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm" }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1.5", children: "One command per line" }, void 0, false

                      )] }, void 0, true
                    ), /*#__PURE__*/


                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Artifacts" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("input", {
                        type: "text",
                        value: selectedStage.artifacts?.join(', ') || '',
                        onChange: (e) => updateStage({ ...selectedStage, artifacts: e.target.value.split(',').map((a) => a.trim()).filter((a) => a) }),
                        placeholder: "dist/*, build/*",
                        className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-mono" }, void 0, false
                      )] }, void 0, true
                    ),


                    selectedStage.type === 'deploy' || selectedStage.type === 'approval' ? /*#__PURE__*/
                    _jsxDEV("div", { className: "p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-3 mb-3", children: [/*#__PURE__*/
                        _jsxDEV(ShieldCheckIcon, { className: "h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                          _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-1", children: "Approval Gate" }, void 0, false

                          ), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: "This stage will pause and wait for manual approval before executing." }, void 0, false

                          )] }, void 0, true
                        )] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer", children: [/*#__PURE__*/
                        _jsxDEV("input", {
                          type: "checkbox",
                          checked: selectedStage.type === 'approval' || selectedStage.type === 'deploy' && selectedStage.requiresApproval !== false,
                          onChange: (e) => {
                            const requiresApproval = e.target.checked;
                            updateStage({
                              ...selectedStage,
                              requiresApproval,
                              requiredApprovers: requiresApproval ? selectedStage.requiredApprovers || 1 : undefined
                            });
                          },
                          className: "rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Require approval before execution" }, void 0, false

                        )] }, void 0, true
                      ),
                      (selectedStage.type === 'approval' || selectedStage.requiresApproval) && /*#__PURE__*/
                      _jsxDEV("div", { className: "mt-3 space-y-2", children: /*#__PURE__*/
                        _jsxDEV("div", { children: [/*#__PURE__*/
                          _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Required Approvers" }, void 0, false

                          ), /*#__PURE__*/
                          _jsxDEV("input", {
                            type: "number",
                            value: selectedStage.requiredApprovers || 1,
                            onChange: (e) => updateStage({
                              ...selectedStage,
                              requiredApprovers: Math.max(1, parseInt(e.target.value) || 1)
                            }),
                            min: 1,
                            max: 5,
                            className: "w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" }, void 0, false
                          ), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Number of approvals needed (production typically requires 2)" }, void 0, false

                          )] }, void 0, true
                        ) }, void 0, false
                      )] }, void 0, true

                    ) :
                    null, /*#__PURE__*/


                    _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                      _jsxDEV("div", { children: [/*#__PURE__*/
                        _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Timeout (min)" }, void 0, false

                        ), /*#__PURE__*/
                        _jsxDEV("input", {
                          type: "number",
                          value: selectedStage.timeout || 10,
                          onChange: (e) => updateStage({ ...selectedStage, timeout: parseInt(e.target.value) || 10 }),
                          min: 1,
                          max: 60,
                          className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm" }, void 0, false
                        )] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { children: [/*#__PURE__*/
                        _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Retries" }, void 0, false

                        ), /*#__PURE__*/
                        _jsxDEV("input", {
                          type: "number",
                          value: selectedStage.retries || 0,
                          onChange: (e) => updateStage({ ...selectedStage, retries: parseInt(e.target.value) || 0 }),
                          min: 0,
                          max: 5,
                          className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm" }, void 0, false
                        )] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/


                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 },
                      onClick: () => {
                        setSelectedStage(null);
                        setHasUnsavedChanges(true);
                      },
                      className: "w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25", children:
                      "Done" }, void 0, false

                    )] }, void 0, true
                  )] }, "settings", true
                ) : /*#__PURE__*/

                _jsxDEV(motion.div, {

                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                  className: "p-6", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center gap-2 mb-5", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl", children: /*#__PURE__*/
                      _jsxDEV(SparklesIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("h3", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "AI Assistant" }, void 0, false

                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-5", children: "Click on a stage to edit its settings, or use AI to help build your pipeline." }, void 0, false

                  ),

                  aiError && /*#__PURE__*/
                  _jsxDEV("div", { className: "mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-700 dark:text-red-400", children:
                    aiError }, void 0, false
                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "space-y-3 mb-6", children: [/*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.02, x: 4 },
                      whileTap: { scale: 0.98 },
                      onClick: handleAIOptimize,
                      disabled: isGeneratingAI,
                      className: "w-full p-4 text-left text-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-lg transition-all shadow-sm hover:shadow-md border border-gray-200 dark:border-slate-600 disabled:opacity-50", children: [/*#__PURE__*/

                      _jsxDEV("span", { className: "mr-2", children: "🔍" }, void 0, false), "Analyze & optimize"] }, void 0, true

                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.02, x: 4 },
                      whileTap: { scale: 0.98 },
                      onClick: handleAddCommonStages,
                      disabled: isGeneratingAI,
                      className: "w-full p-4 text-left text-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-lg transition-all shadow-sm hover:shadow-md border border-gray-200 dark:border-slate-600 disabled:opacity-50", children: [/*#__PURE__*/

                      _jsxDEV("span", { className: "mr-2", children: "🛠️" }, void 0, false), "Add common stages"] }, void 0, true

                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "border-t border-gray-200 dark:border-slate-700 pt-5", children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Describe your pipeline" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("textarea", {
                      value: aiDescription,
                      onChange: (e) => setAiDescription(e.target.value),
                      placeholder: "e.g., Build a Node.js app with tests and deploy to Kubernetes...",
                      className: "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm",
                      rows: 4 }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: isGeneratingAI ? 1 : 1.02 },
                      whileTap: { scale: isGeneratingAI ? 1 : 0.98 },
                      onClick: handleAIGenerate,
                      disabled: isGeneratingAI,
                      className: "mt-4 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed", children:

                      isGeneratingAI ? /*#__PURE__*/
                      _jsxDEV("span", { className: "flex items-center justify-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("svg", { className: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [/*#__PURE__*/
                          _jsxDEV("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false)] }, void 0, true
                        ), "Generating..."] }, void 0, true

                      ) :

                      'Generate with AI' }, void 0, false

                    )] }, void 0, true
                  )] }, "ai-assistant", true
                ) }, void 0, false

              ) }, void 0, false
            ) }, void 0, false
          )] }, void 0, true
        ) : /*#__PURE__*/

        _jsxDEV(_Fragment, { children: [/*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "col-span-2 min-h-0 p-6 flex flex-col", children: /*#__PURE__*/

            _jsxDEV(GlassCard, { padding: "none", className: "flex-1 min-h-0 overflow-hidden flex flex-col", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex-shrink-0 px-5 py-4 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border-b border-white/20 dark:border-slate-700/50 flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV(CodeBracketIcon, { className: "h-5 w-5 text-purple-500" }, void 0, false), "Pipeline Configuration"] }, void 0, true

                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [
                      yaml.split('\n').length, " lines • ", yaml.length, " characters"] }, void 0, true
                    )] }, void 0, true
                  ),
                  hasUnsavedChanges && /*#__PURE__*/
                  _jsxDEV("span", { className: "px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full", children: "Unsaved" }, void 0, false

                  )] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: handleCopy,
                  className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm", children:

                  copied ? /*#__PURE__*/
                  _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                    _jsxDEV(CheckIcon, { className: "h-4 w-4 text-emerald-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-emerald-600 dark:text-emerald-400", children: "Copied!" }, void 0, false)] }, void 0, true
                  ) : /*#__PURE__*/

                  _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                    _jsxDEV(DocumentDuplicateIcon, { className: "h-4 w-4" }, void 0, false), "Copy"] }, void 0, true

                  ) }, void 0, false

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("textarea", {
                value: yaml,
                onChange: (e) => {
                  setYaml(e.target.value);
                  setHasUnsavedChanges(true);
                },
                className: "flex-1 min-h-0 p-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 code-scrollbar overflow-auto leading-relaxed",
                spellCheck: false,
                placeholder: "Enter your pipeline YAML..." }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV(motion.div, {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            className: "flex flex-col min-h-0 overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-l border-gray-200/50 dark:border-slate-700/50 shadow-sm", children: /*#__PURE__*/

            _jsxDEV("div", { className: "flex-1 min-h-0 overflow-y-auto code-scrollbar", children: /*#__PURE__*/
              _jsxDEV(AnimatePresence, { mode: "wait", children:
                showTemplates ? /*#__PURE__*/
                _jsxDEV(motion.div, {

                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                  className: "p-6", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center justify-between mb-5", children: [/*#__PURE__*/
                    _jsxDEV("h3", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Templates" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      onClick: () => setShowTemplates(false),
                      className: "p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: /*#__PURE__*/

                      _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false) }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-3", children:
                    TEMPLATES.map((template) => /*#__PURE__*/
                    _jsxDEV(motion.button, {

                      whileHover: { scale: 1.02, x: 4 },
                      whileTap: { scale: 0.98 },
                      onClick: () => handleTemplateSelect(template),
                      className: "w-full p-4 text-left bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-white/20 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-500 rounded-xl transition-all backdrop-blur-sm", children: /*#__PURE__*/

                      _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: "text-3xl", children: template.icon }, void 0, false), /*#__PURE__*/
                        _jsxDEV("div", { children: [/*#__PURE__*/
                          _jsxDEV("h4", { className: "text-sm font-bold text-gray-900 dark:text-white", children:
                            template.name }, void 0, false
                          ), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Pipeline template" }, void 0, false

                          )] }, void 0, true
                        )] }, void 0, true
                      ) }, template.name, false
                    )
                    ) }, void 0, false
                  )] }, "templates", true
                ) : /*#__PURE__*/

                _jsxDEV(motion.div, {

                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                  className: "p-6", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center gap-2 mb-5", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl", children: /*#__PURE__*/
                      _jsxDEV(SparklesIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("h3", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "AI Assistant" }, void 0, false

                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: () => setShowTemplates(true),
                    className: "w-full mb-5 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all backdrop-blur-sm", children:
                    "Browse Templates" }, void 0, false

                  ),

                  aiError && /*#__PURE__*/
                  _jsxDEV("div", { className: "mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-700 dark:text-red-400", children:
                    aiError }, void 0, false
                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "space-y-3 mb-6", children: [/*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.02, x: 4 },
                      whileTap: { scale: 0.98 },
                      onClick: handleAIOptimize,
                      disabled: isGeneratingAI,
                      className: "w-full p-4 text-left text-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-lg transition-all shadow-sm hover:shadow-md border border-gray-200 dark:border-slate-600 disabled:opacity-50", children: [/*#__PURE__*/

                      _jsxDEV("span", { className: "mr-2", children: "🔍" }, void 0, false), "Analyze YAML"] }, void 0, true

                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.02, x: 4 },
                      whileTap: { scale: 0.98 },
                      onClick: () => {
                        // Add build stage YAML
                        const buildYaml = `
    - name: Build
      steps:
        - name: "Install dependencies"
          command: "npm install"
        - name: "Build application"
          command: "npm run build"`;
                        setYaml((prev) => prev + buildYaml);
                        setHasUnsavedChanges(true);
                      },
                      disabled: isGeneratingAI,
                      className: "w-full p-4 text-left text-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-lg transition-all shadow-sm hover:shadow-md border border-gray-200 dark:border-slate-600 disabled:opacity-50", children: [/*#__PURE__*/

                      _jsxDEV("span", { className: "mr-2", children: "🛠️" }, void 0, false), "Add build steps"] }, void 0, true

                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.02, x: 4 },
                      whileTap: { scale: 0.98 },
                      onClick: () => {
                        // Add deploy stage YAML
                        const deployYaml = `
    - name: Deploy
      requiresApproval: true
      steps:
        - name: "Deploy to production"
          command: "npm run deploy"`;
                        setYaml((prev) => prev + deployYaml);
                        setHasUnsavedChanges(true);
                      },
                      disabled: isGeneratingAI,
                      className: "w-full p-4 text-left text-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-lg transition-all shadow-sm hover:shadow-md border border-gray-200 dark:border-slate-600 disabled:opacity-50", children: [/*#__PURE__*/

                      _jsxDEV("span", { className: "mr-2", children: "🚀" }, void 0, false), "Add deploy steps"] }, void 0, true

                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "border-t border-gray-200 dark:border-slate-700 pt-5", children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Describe your pipeline" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("textarea", {
                      value: aiDescription,
                      onChange: (e) => setAiDescription(e.target.value),
                      placeholder: "e.g., Build a Node.js app and deploy to Kubernetes...",
                      className: "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm",
                      rows: 4 }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: isGeneratingAI ? 1 : 1.02 },
                      whileTap: { scale: isGeneratingAI ? 1 : 0.98 },
                      onClick: handleAIGenerate,
                      disabled: isGeneratingAI,
                      className: "mt-4 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed", children:

                      isGeneratingAI ? /*#__PURE__*/
                      _jsxDEV("span", { className: "flex items-center justify-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("svg", { className: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [/*#__PURE__*/
                          _jsxDEV("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false)] }, void 0, true
                        ), "Generating..."] }, void 0, true

                      ) :

                      'Generate with AI' }, void 0, false

                    )] }, void 0, true
                  )] }, "ai", true
                ) }, void 0, false

              ) }, void 0, false
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(RepositorySelector, {
        isOpen: showRepoSelector,
        onClose: () => setShowRepoSelector(false),
        onSelect: handleRepoSelect,
        currentConfig: repoConfig || undefined }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showRecommendationsModal && aiRecommendations && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
          onClick: () => setShowRecommendationsModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { opacity: 0, scale: 0.95, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: 20 },
            className: "w-full max-w-2xl max-h-[80vh] overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-2xl",
            onClick: (e) => e.stopPropagation(), children: [/*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl", children: /*#__PURE__*/
                  _jsxDEV(SparklesIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "AI Recommendations" }, void 0, false

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setShowRecommendationsModal(false),
                className: "p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: /*#__PURE__*/

                _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "px-6 py-4 overflow-y-auto max-h-[60vh]", children: /*#__PURE__*/
              _jsxDEV("div", { className: "prose dark:prose-invert prose-sm max-w-none", children: /*#__PURE__*/
                _jsxDEV("pre", { className: "whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700", children:
                  aiRecommendations }, void 0, false
                ) }, void 0, false
              ) }, void 0, false
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50", children: [/*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => setShowRecommendationsModal(false),
                className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors", children:
                "Close" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => {
                  navigator.clipboard.writeText(aiRecommendations);
                  setShowRecommendationsModal(false);
                },
                className: "px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25", children:
                "Copy & Close" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}