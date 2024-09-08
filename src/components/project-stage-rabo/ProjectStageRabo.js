import '../../App.css';
import '../../assets/css/Modals.css';
import './ProgressBar.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import ja from 'date-fns/locale/ja';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import {
  faChartLine,
  faSave,
  faTrashAlt,
  faArrowLeft,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';

const formatDateFromString = dateString => {
  // Assuming dateString is in the format "yyyy年MM月dd日"
  return parse(dateString, 'yyyy年MM月dd日', new Date(), { locale: ja });
};

const formatDateForDisplay = date => {
  return format(date, 'yyyy年MM月dd日', { locale: ja });
};

// let's say the project is website design (sample data)
// all in japanese
const project = {
  id: 1,
  name: 'サイト作成',
  description: 'クライアントが求めるサイトを作成する',
  assignee: '山田宏',
  start_date: '2023年12月20日',
  end_date: '2024年02月20日', // 2 months
  deadline: '2024年02月20日',
  tasks: [
    {
      id: 1,
      complete_percentage: 100,
      name: '環境設定',
      weight: 2,
      description: 'サイトを作成するための環境を設定する',
      incharge: '山田太郎',
      start_date: '2024年2月1日',
      end_date: '2024年2月2日',
      deadline: '2024年2月2日',
    },
    {
      id: 2,
      complete_percentage: 100,
      name: '初期スケッチ',
      weight: 2,
      description: 'サイトの初期スケッチを作成する',
      incharge: '山田太郎',
      start_date: '2024年2月2日',
      end_date: '2024年2月3日',
      deadline: '2024年2月3日',
    },
    {
      id: 3,
      complete_percentage: 100,
      name: '初期プレゼン',
      weight: 2,
      description: '初期スケッチをクライアントにプレゼンする',
      incharge: '山田太郎',
      start_date: '2024年2月3日',
      end_date: '2024年2月4日',
      deadline: '2024年2月4日',
    },
    {
      id: 4,
      complete_percentage: 40,
      name: 'ホームページ',
      weight: 2,
      description: 'ホームページを作成する',
      incharge: '山田太郎',
      start_date: '2024年2月4日',
      end_date: '2024年2月10日',
      deadline: '2024年2月10日',
    },
    {
      id: 5,
      complete_percentage: 10,
      name: 'ページレイアウト',
      weight: 2,
      description: 'ページのレイアウトを決める',
      incharge: '山田太郎',
      start_date: '2024年2月10日',
      end_date: '2024年2月15日',
      deadline: '2024年2月15日',
    },
    {
      id: 6,
      complete_percentage: 0,
      name: 'CSSデザイン',
      weight: 2,
      description: 'CSSデザインを作成する',
      incharge: '山田太郎',
      start_date: '2024年2月15日',
      end_date: '2024年2月20日',
      deadline: '2024年2月20日',
    },
    {
      id: 7,
      complete_percentage: 0,
      name: 'JS実装',
      weight: 2,
      description: 'JS実装を行う',
      incharge: '山田太郎',
      start_date: '2024年2月20日',
      end_date: '2024年2月25日',
      deadline: '2024年2月25日',
    },
    {
      id: 8,
      complete_percentage: 0,
      name: 'モバイルデザイン',
      weight: 2,
      description: 'モバイルデザインを作成する',
      incharge: '山田太郎',
      start_date: '2024年2月25日',
      end_date: '2024年3月1日',
      deadline: '2024年3月1日',
    },
  ],
};

// Define your functional component
const ProjectStageRabo = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/interface-rb');
  };

  const charCutOff = str => {
    if (str && str.length > 5) {
      return str.substring(0, 5) + '...';
    }
    return str;
  }; // if the task name is too long, cut it off and add "..." at the end

  const [isCompleteSelected, setIsCompleteSelected] = useState(null); // true if complete tasks are selected, false if uncompleted tasks are selected
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentView, setCurrentView] = useState('project'); // project or task view

  // check if you can edit the task itself
  const hasEditPermission = true; // change this later on to check if the user has permission to edit the task

  const handleSelectTask = taskId => {
    const task = project.tasks.find(task => task.id === taskId);
    setSelectedTask(task);
    setCurrentView('task');
  };

  const handleBackToProject = () => {
    setSelectedTask(null);
    setCurrentView('project');
  };

  const handleNewTask = () => {
    // create a new task
    const newTask = {
      id: project.tasks.length + 1,
      complete_percentage: 0,
      name: '新規タスク',
      weight: 0,
      description: '',
      incharge: '',
      start_date: formatDateForDisplay(new Date()),
      end_date: formatDateForDisplay(new Date()),
      deadline: formatDateForDisplay(new Date()),
    };
    project.tasks.push(newTask);
    setSelectedTask(newTask);
    setCurrentView('task');
  };

  const saveTaskInfo = () => {
    // save the task information
    // get the values from the input fields
    return;
  }; // fix this after implenentation

  const deleteTaskInfo = () => {
    // delete the task information
    // delete the task from the project
    return;
  }; // fix this after implementation

  const ActionButtons = () => {
    return (
      <>
        <div className="action-buttons" style={{ marginTop: '15px' }}>
          <button onClick={() => saveTaskInfo()} disabled={!hasEditPermission}>
            <FontAwesomeIcon icon={faSave} fixedWidth />
            保存
          </button>
          <button
            onClick={() => deleteTaskInfo()}
            disabled={!hasEditPermission}
          >
            <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
            削除
          </button>
          {/* with faCircle info just deselect task and change th project view */}
        </div>
        <div className="action-buttons page" style={{ marginTop: '15px' }}>
          <button onClick={() => handleBackToProject()}>
            <FontAwesomeIcon icon={faCircleInfo} fixedWidth />
            プロジェクト情報に戻る
          </button>
        </div>
      </>
    );
  };

  // change overallProgress to be a rounded to nearest integer, taking in weight of the task and complete percentage as well as all tasks
  const calculateProjectProgress = () => {
    const totalWeight = project.tasks.reduce(
      (acc, task) => acc + task.weight,
      0,
    );
    const totalProgress = project.tasks.reduce(
      (acc, task) => acc + task.weight * task.complete_percentage,
      0,
    );
    return Math.round(totalProgress / totalWeight);
  };

  const overallProgress = calculateProjectProgress();

  return (
    <>
      <div className="relative_container">
        <div className="title_container">
          <div className="section_title">
            <FontAwesomeIcon className="faIcon" icon={faChartLine} />
            プロジェクト段階
          </div>
          <div className="back_button" onClick={handleBackClick}>
            <FontAwesomeIcon className="faIcon back" icon={faArrowLeft} />
            戻る
          </div>
        </div>
      </div>

      <div className="management-container" style={{ padding: '0 20px' }}>
        {
          // view is project
          currentView === 'project' && (
            <div className="progress-container">
              <div className="progress-bar-text">{overallProgress}% 完了</div>
              <div className="progress-bar">
                <div
                  className="progress-bar-inner"
                  style={{ width: `${overallProgress}%` }}
                >
                  {' '}
                </div>
              </div>
            </div>
          )
        }
        {
          // view is task
          currentView === 'task' && (
            <div className="progress-container">
              <div className="progress-bar-text">
                {selectedTask.complete_percentage}% 完了
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-inner"
                  style={{ width: `${selectedTask.complete_percentage}%` }}
                >
                  {' '}
                </div>
              </div>
            </div>
          )
        }
      </div>

      <div className="management-container">
        {/* group by completed and uncompleted tasks */}
        {/* then if completed is selected you render the completed tasks, else you render the uncompleted tasks */}
        {/* organize by order in completion then in id. if complete ===100 will be front, then grouped by id */}
        <div className="list task-list">
          <div
            className="list-item"
            onClick={() => setIsCompleteSelected(true)}
          >
            完了タスク
          </div>
          <div
            className="list-item"
            onClick={() => setIsCompleteSelected(false)}
          >
            未完了タスク
          </div>

          {hasEditPermission && (
            <>
              <div
                className="list-item new-button"
                onClick={() => handleNewTask()}
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ marginRight: '10px' }}
                />
                新規タスク
              </div>
            </>
          )}
        </div>
        {isCompleteSelected === true && (
          <div className="list task-list">
            {project.tasks
              .filter(task => task.complete_percentage === 100)
              .map(task => (
                <div
                  key={task.id}
                  className={`list-item ${
                    selectedTask && selectedTask.id === task.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleSelectTask(task.id)}
                >
                  {charCutOff(task.name)}
                </div>
              ))}
          </div>
        )}

        {isCompleteSelected === false && (
          <div className="list task-list">
            {project.tasks
              .filter(task => task.complete_percentage < 100)
              .map(task => (
                <div
                  key={task.id}
                  className={`list-item ${
                    selectedTask && selectedTask.id === task.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleSelectTask(task.id)}
                >
                  {charCutOff(task.name)}
                </div>
              ))}
          </div>
        )}

        {!selectedTask && currentView === 'project' && (
          // display project information using
          <>
            {/* insert  */}

            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">基本情報</h3>
                <div className="form-group">
                  <label htmlFor="name">プロジェクト名</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={project.name}
                    disabled={!hasEditPermission}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">プロジェクト説明</label>
                  <textarea
                    id="description"
                    name="description"
                    value={project.description}
                    disabled={!hasEditPermission}
                  />
                </div>

                {/* who is assigned, project tantou */}
                <div className="form-group">
                  <label htmlFor="assignee">担当者</label>
                  <input
                    id="assignee"
                    name="assignee"
                    type="text"
                    value={project.assignee}
                    disabled={!hasEditPermission}
                  />
                </div>
              </div>

              {/* now dates */}
              <div className="form-column">
                <h3 className="form-header">日程</h3>
                <div className="form-group">
                  <label htmlFor="start_date">開始日</label>
                  <DatePicker
                    id="start_date"
                    selected={formatDateFromString(project.start_date)}
                    disabled={!hasEditPermission}
                    dateFormat="yyyy年MM月dd日"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">終了日</label>
                  <DatePicker
                    id="end_date"
                    selected={
                      formatDateFromString(project.end_date) || new Date()
                    }
                    disabled={!hasEditPermission}
                    dateFormat="yyyy年MM月dd日"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deadline">期限</label>
                  <DatePicker
                    id="deadline"
                    selected={formatDateFromString(project.deadline)}
                    disabled={!hasEditPermission}
                    dateFormat="yyyy年MM月dd日"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTask && currentView === 'task' && (
          <>
            <div className="form-columns-container">
              <div className="form-column">
                <h3 className="form-header">タスク情報</h3>
                <div className="form-group">
                  <label htmlFor="name">タスク名</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={selectedTask.name}
                    disabled={!hasEditPermission}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">タスク説明</label>
                  <textarea
                    style={{ height: '75px' }}
                    id="description"
                    name="description"
                    value={selectedTask.description}
                    disabled={!hasEditPermission}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="incharge">担当者</label>
                  <input
                    id="incharge"
                    name="incharge"
                    type="text"
                    value={selectedTask.incharge}
                    disabled={!hasEditPermission}
                  />
                </div>
              </div>

              <div className="form-column">
                <h3 className="form-header">日程</h3>
                <div className="form-group">
                  <label htmlFor="start_date">開始日</label>
                  <DatePicker
                    id="start_date"
                    selected={formatDateFromString(selectedTask.start_date)}
                    disabled={!hasEditPermission}
                    dateFormat="yyyy年MM月dd日"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">終了日</label>
                  <DatePicker
                    id="end_date"
                    selected={formatDateFromString(selectedTask.end_date)}
                    disabled={!hasEditPermission}
                    dateFormat="yyyy年MM月dd日"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deadline">期限</label>
                  <DatePicker
                    id="deadline"
                    selected={formatDateFromString(selectedTask.deadline)}
                    disabled={!hasEditPermission}
                    dateFormat="yyyy年MM月dd日"
                  />
                </div>
              </div>

              <div className="form-column">
                {/* other information like ID and priority */}
                <h3 className="form-header">その他</h3>
                <div className="form-group">
                  <label htmlFor="id">ID</label>
                  <input
                    id="id"
                    name="id"
                    type="text"
                    value={selectedTask.id}
                    disabled
                  />
                </div>

                <div className="form-group">
                  {/* complete p */}
                  <label htmlFor="complete_percentage">
                    完了度
                    <span
                      style={{
                        fontSize: '.75rem',
                        color: '#858585',
                        marginLeft: '5px',
                      }}
                    >
                      (0 - 100%)
                    </span>
                  </label>
                  <input
                    id="complete_percentage"
                    name="complete_percentage"
                    type="number"
                    value={selectedTask.complete_percentage}
                    disabled={!hasEditPermission}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">重み</label>
                  <input
                    id="weight"
                    name="weight"
                    type="text"
                    value={selectedTask.weight}
                    disabled={!hasEditPermission}
                  />
                </div>

                <ActionButtons />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProjectStageRabo;

// Define the task class
/*

class project
id: project id (unique per project) from 1->n projects
name: name of project
description: description of project
start_date: start date of project string formatted like yyyynen ngetsu nichi
end_date: end date of project
deadline: deadline of project (promise date)
tasks: list of tasks

class task
id: task id (unique per project) from 1->n tasks
complete_percentage: 0-100 (if 100, means that task is complete)
name: name of task
weight: weight of task (0-10)
description: description of task
incharge: who is in charge of the task (string)
start_date: start date of task
end_date: end date of task
deadline: deadline of task (promise date)
*/
