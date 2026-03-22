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
  const { user, userList, setUser, isSelected } = useUser();
  const { topics, addTopic, updateTopic, completeTopic } = useTopics();
  const { tasks, addTask, updateTask, completeTask } = useTasks();
  const { tags, addTag } = useTags();

  const [activeTab, setActiveTab] = useState('themen');
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [followUpTopic, setFollowUpTopic] = useState(null);
  const [followUpTask, setFollowUpTask] = useState(null);
  const [editTopic, setEditTopic] = useState(null);
  const [editTask, setEditTask] = useState(null);

  const isEmpty = activeTab === 'themen'
    ? topics.filter(t => !t.parent_id && t.status !== 'done').length === 0
    : tasks.filter(t => !t.parent_id && t.status !== 'done').length === 0;

  const handleFabClick = () => {
    if (activeTab === 'themen') {
      setFollowUpTopic(null); setEditTopic(null); setShowCreateTopic(true);
    } else {
      setFollowUpTask(null); setEditTask(null); setShowCreateTask(true);
    }
  };

  // Topic handlers
  const handleCreateTopic = (data) => { addTopic(data); setShowCreateTopic(false); setFollowUpTopic(null); };
  const handleSaveTopic = useCallback((topic) => { updateTopic(topic.id, topic); setShowCreateTopic(false); setEditTopic(null); }, [updateTopic]);
  const handleCompleteTopic = useCallback((topic) => { completeTopic(topic.id); setFeedbackMessage(getRandomMessage()); setShowFeedback(true); }, [completeTopic]);
  const handleFollowUpTopic = useCallback((topic) => { setEditTopic(null); setFollowUpTopic(topic); setShowCreateTopic(true); }, []);
  const handleUpdateTopic = useCallback((topic) => { updateTopic(topic.id, topic); }, [updateTopic]);
  const handleEditTopic = useCallback((topic) => { setFollowUpTopic(null); setEditTopic(topic); setShowCreateTopic(true); }, []);

  // Task handlers
  const handleCreateTask = (data) => { addTask(data); setShowCreateTask(false); setFollowUpTask(null); };
  const handleSaveTask = useCallback((task) => { updateTask(task.id, task); setShowCreateTask(false); setEditTask(null); }, [updateTask]);
  const handleCompleteTask = useCallback((task) => { completeTask(task.id); setFeedbackMessage(getRandomMessage()); setShowFeedback(true); }, [completeTask]);
  const handleFollowUpTask = useCallback((task) => { setEditTask(null); setFollowUpTask(task); setShowCreateTask(true); }, []);
  const handleUpdateTask = useCallback((task) => { updateTask(task.id, task); }, [updateTask]);
  const handleEditTask = useCallback((task) => { setFollowUpTask(null); setEditTask(task); setShowCreateTask(true); }, []);

  const handleCreateTag = (name, bgColor, textColor) => { addTag(name, bgColor, textColor); setShowCreateTag(false); };
  const handleHideFeedback = useCallback(() => { setShowFeedback(false); }, []);

  if (!isSelected) {
    return <UserSelector onSelect={setUser} />;
  }

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab} greeting={getGreeting()} userName={user?.name} onFabClick={handleFabClick} isEmpty={isEmpty}>
        {activeTab === 'themen' ? (
          <Topics topics={topics} tags={tags} userList={userList} onComplete={handleCompleteTopic} onFollowUp={handleFollowUpTopic} onUpdate={handleUpdateTopic} onEdit={handleEditTopic} />
        ) : (
          <Tasks tasks={tasks} tags={tags} userList={userList} onComplete={handleCompleteTask} onFollowUp={handleFollowUpTask} onUpdate={handleUpdateTask} onEdit={handleEditTask} />
        )}
      </Layout>

      <CreateTopicSheet
        isOpen={showCreateTopic}
        onClose={() => { setShowCreateTopic(false); setFollowUpTopic(null); setEditTopic(null); }}
        onSubmit={handleCreateTopic} onSave={handleSaveTopic}
        tags={tags} currentUser={user?.id} userList={userList}
        onCreateTag={() => setShowCreateTag(true)}
        parentTopic={followUpTopic} editTopic={editTopic}
      />

      <CreateTaskSheet
        isOpen={showCreateTask}
        onClose={() => { setShowCreateTask(false); setFollowUpTask(null); setEditTask(null); }}
        onSubmit={handleCreateTask} onSave={handleSaveTask}
        tags={tags} currentUser={user?.id} userList={userList}
        onCreateTag={() => setShowCreateTag(true)}
        parentTask={followUpTask} editTask={editTask}
      />

      <CreateTagSheet isOpen={showCreateTag} onClose={() => setShowCreateTag(false)} onSubmit={handleCreateTag} />
      <FeedbackToast message={feedbackMessage} visible={showFeedback} onHide={handleHideFeedback} />
    </>
  );
}
