import { useState, useCallback } from 'react';
import { useUser } from './hooks/useUser';
import { useTopics } from './hooks/useTopics';
import { useTasks } from './hooks/useTasks';
import { useTags } from './hooks/useTags';
import { getGreeting, getRandomMessage } from './lib/constants';
import Layout from './components/Layout';
import UserSelector from './components/UserSelector';
import Topics from './pages/Topics';
import Tasks from './pages/Tasks';
import CreateTopicSheet from './components/CreateTopicSheet';
import CreateTaskSheet from './components/CreateTaskSheet';
import CreateTagSheet from './components/CreateTagSheet';
import FeedbackToast from './components/FeedbackToast';

export default function App() {
  const { user, setUser, isSelected } = useUser();
  const { topics, addTopic, updateTopic, completeTopic, createFollowUp: createTopicFollowUp } = useTopics();
  const { tasks, addTask, updateTask, completeTask, createFollowUp: createTaskFollowUp } = useTasks();
  const { tags, addTag } = useTags();

  const [activeTab, setActiveTab] = useState('themen');
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [followUpTopic, setFollowUpTopic] = useState(null);
  const [followUpTask, setFollowUpTask] = useState(null);

  const openTopics = topics.filter(t => t.status === 'open');
  const openTasks = tasks.filter(t => t.status === 'open');
  const isEmpty = activeTab === 'themen' ? openTopics.length === 0 : openTasks.length === 0;

  const handleFabClick = () => {
    if (activeTab === 'themen') {
      setFollowUpTopic(null);
      setShowCreateTopic(true);
    } else {
      setFollowUpTask(null);
      setShowCreateTask(true);
    }
  };

  const handleCreateTopic = (data) => {
    addTopic(data);
    setShowCreateTopic(false);
    setFollowUpTopic(null);
  };

  const handleCompleteTopic = useCallback((topic) => {
    completeTopic(topic.id);
    setFeedbackMessage(getRandomMessage());
    setShowFeedback(true);
  }, [completeTopic]);

  const handleFollowUpTopic = useCallback((topic) => {
    setFollowUpTopic(topic);
    setShowCreateTopic(true);
  }, []);

  const handleUpdateTopic = useCallback((topic) => {
    updateTopic(topic.id, topic);
  }, [updateTopic]);

  const handleCreateTask = (data) => {
    addTask(data);
    setShowCreateTask(false);
    setFollowUpTask(null);
  };

  const handleCompleteTask = useCallback((task) => {
    completeTask(task.id);
    setFeedbackMessage(getRandomMessage());
    setShowFeedback(true);
  }, [completeTask]);

  const handleFollowUpTask = useCallback((task) => {
    setFollowUpTask(task);
    setShowCreateTask(true);
  }, []);

  const handleUpdateTask = useCallback((task) => {
    updateTask(task.id, task);
  }, [updateTask]);

  const handleCreateTag = (name, bgColor, textColor) => {
    addTag(name, bgColor, textColor);
    setShowCreateTag(false);
  };

  const handleHideFeedback = useCallback(() => {
    setShowFeedback(false);
  }, []);

  if (!isSelected) {
    return <UserSelector onSelect={setUser} />;
  }

  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        greeting={getGreeting()}
        userName={user?.name}
        onFabClick={handleFabClick}
        isEmpty={isEmpty}
      >
        {activeTab === 'themen' ? (
          <Topics
            topics={topics}
            tags={tags}
            onComplete={handleCompleteTopic}
            onFollowUp={handleFollowUpTopic}
            onUpdate={handleUpdateTopic}
          />
        ) : (
          <Tasks
            tasks={tasks}
            tags={tags}
            onComplete={handleCompleteTask}
            onFollowUp={handleFollowUpTask}
            onUpdate={handleUpdateTask}
          />
        )}
      </Layout>

      <CreateTopicSheet
        isOpen={showCreateTopic}
        onClose={() => { setShowCreateTopic(false); setFollowUpTopic(null); }}
        onSubmit={handleCreateTopic}
        tags={tags}
        currentUser={user?.id}
        onCreateTag={() => setShowCreateTag(true)}
        parentTopic={followUpTopic}
      />

      <CreateTaskSheet
        isOpen={showCreateTask}
        onClose={() => { setShowCreateTask(false); setFollowUpTask(null); }}
        onSubmit={handleCreateTask}
        tags={tags}
        currentUser={user?.id}
        onCreateTag={() => setShowCreateTag(true)}
        parentTask={followUpTask}
      />

      <CreateTagSheet
        isOpen={showCreateTag}
        onClose={() => setShowCreateTag(false)}
        onSubmit={handleCreateTag}
      />

      <FeedbackToast
        message={feedbackMessage}
        visible={showFeedback}
        onHide={handleHideFeedback}
      />
    </>
  );
}
