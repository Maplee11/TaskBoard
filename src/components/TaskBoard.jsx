import React, {useState, useRef, useEffect} from 'react';
import Modal from 'react-modal';
import GetUsrInput from "./GetUsrInput.jsx";
import { useDrag, useDrop } from 'react-dnd';
import axios from 'axios';
import Accounts from "./Accounts.jsx";
import Project from "./Project.jsx";
import {data} from "autoprefixer";

const client = axios.default;

Modal.setAppElement('#root');

const ItemTypes = {
    TASK: 'task',
};

const backendUrl = "http://192.168.190.1:7001";

const TaskBoard = () => {
    const [editMode, setEditMode] = useState(false);
    const [taskList, setTask] = useState({todo: [], undergoing: [], done: []});
    const [createBackupBanner, setCreateBackupBanner] = useState(false);
    const [loadBackupBanner, setLoadBackupBanner] = useState(false);
    const [isInitialized, setInitialize] = useState(false);
    const [projectName, setProjectName] = useState("示例项目");
    const [currentUsr, setCurrentUsr] = useState("");
    const [logged, setLogged] = useState(false);


    const clearAllBanner = () => {
        setCreateBackupBanner(false);
        setLoadBackupBanner(false);
    }

    const createBackup = () => {
        clearAllBanner();
        setCreateBackupBanner(true);
        setTimeout(() => setCreateBackupBanner(false), 1000);
    }

    const loadBackup = () => {
        clearAllBanner();
        setLoadBackupBanner(true);
        setTimeout(() => setLoadBackupBanner(false), 1000);
    }

    return (
        <div>
            {createBackupBanner && (
                <div
                    className={`absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 shadow-lg rounded-lg flex justify-center items-center z-50 transition-transform duration-300 ease-in-out ${createBackupBanner ? 'animate-slide-down' : 'animate-slide-up'}`}
                >
                    备份已创建
                </div>
            )}
            {loadBackupBanner && (
                <div
                    className={`absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 shadow-lg rounded-lg flex justify-center items-center z-50 transition-transform duration-300 ease-in-out ${loadBackupBanner ? 'animate-slide-down' : 'animate-slide-up'}`}
                >
                    备份已加载
                </div>
            )}
            <button
                onClick={() => setEditMode(!editMode)}
                className="mt-4 px-4 py-2 bg-blue-800 text-white rounded"
            >
                {editMode ? "退出编辑" : "编辑模式"}
            </button>
            <button onClick={createBackup} className="mt-4 px-4 py-2 bg-green-800 text-white rounded">
                创建备份
            </button>
            <button onClick={loadBackup} className="mt-4 px-4 py-2 bg-fuchsia-800 text-white rounded">
                加载备份
            </button>
            <br/>
            <br/>
            <Accounts setProjectName={setProjectName} setLogged={setLogged} setTask={setTask} backendUrl={backendUrl} taskList={taskList} isInitialized={isInitialized} setInitialize={setInitialize} currentUsr={currentUsr} setCurrentUsr={setCurrentUsr} projectName={projectName}/>
            <br/>
            {logged && <Project setProjectName={setProjectName} setTask={setTask} backendUrl={backendUrl} taskList={taskList}  projectName={projectName} isInitialized={isInitialized} setInitialize={setInitialize} currentUsr={currentUsr} setCurrentUsr={setCurrentUsr}/>}
            <TasksArea currentUsr={currentUsr} projectName={projectName} editMode={editMode} setTask={setTask} taskList={taskList}/>
        </div>
    );
}

// eslint-disable-next-line react/prop-types
const TasksArea = ({editMode, currentUsr, projectName, setTask, taskList}) => {
    const [newTask, setNewTask] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const modalResolve = useRef(null);

    const openModal = () => {
        return new Promise((resolve) => {
            setModalIsOpen(true);
            modalResolve.current = resolve;
        });
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const save2newTask = () => {
        if(newTask !== "" && modalResolve.current)
            modalResolve.current(newTask);
    }

    const addTask = async (listName) => {
        setNewTask("");
        let newTask_ = await openModal();

        setTask((prevTasks) => ({
            ...prevTasks,
            [listName]: [...prevTasks[listName], newTask_],
        }));
    };

    const deleteTask = (listName, taskIndex) => {
        setTask((prevTasks) => ({
            ...prevTasks,
            [listName]: prevTasks[listName].filter((_, index) => index !== taskIndex),
        }));
    };

    const moveTask = (fromList, toList, taskIndex) => {
        setTask((prevTasks) => {
            const task = prevTasks[fromList][taskIndex];
            return {
                ...prevTasks,
                [fromList]: prevTasks[fromList].filter((_, index) => index !== taskIndex),
                [toList]: [...prevTasks[toList], task],
            };
        });
    };

    return (
        <div className="flex h-screen p-4 space-x-4">
            <Column currentUsr={currentUsr} projectName={projectName} taskList={taskList} title="未开始" listName="todo" addTaskHandler={addTask} editMode={editMode}
                    deleteTaskHandler={deleteTask} moveTaskHandler={moveTask}/>
            <Column currentUsr={currentUsr} projectName={projectName} taskList={taskList} title="执行中" listName="undergoing" addTaskHandler={addTask}
                    editMode={editMode} deleteTaskHandler={deleteTask} moveTaskHandler={moveTask}/>
            <Column currentUsr={currentUsr} projectName={projectName} taskList={taskList} title="已完成" listName="done" addTaskHandler={addTask} editMode={editMode}
                    deleteTaskHandler={deleteTask} moveTaskHandler={moveTask}/>

            <Modal
                isOpen={modalIsOpen}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'black',
                        borderRadius: '12px',
                    },
                }}
            >
                <div className="flex-wrap justify-center">
                    <GetUsrInput setUsrInput={setNewTask} placeholder={"请输入任务名"}/>
                    <br/>
                    <button onClick={() => {
                        save2newTask();
                        closeModal();
                    }} className="mt-4 px-8 py-2 bg-green-500 text-white rounded">
                        保存
                    </button>
                    <button onClick={closeModal} className="px-8 py-2 bg-red-500 text-white rounded">
                        取消
                    </button>
                </div>
            </Modal>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const Column = ({taskList, currentUsr, projectName, title, listName, addTaskHandler, editMode, deleteTaskHandler, moveTaskHandler}) => {
    const [, drop] = useDrop({
        accept: ItemTypes.TASK,
        drop: (item, monitor) => {
            const hoverIndex = monitor.getItem().index;
            const dragIndex = item.index;
            if (item.listName === listName && dragIndex === hoverIndex) {
                return;
            }
            moveTaskHandler(item.listName, listName, dragIndex, hoverIndex);
            item.index = hoverIndex;
            item.listName = listName;
        },
    });

    return (
        <div ref={drop} className="bg-gradient-to-l rounded-lg shadow p-4 inline-block min-w-max flex-grow">
            <h2 className="mb-1.5 w-full bg-red-700 font-bold text-1xl text-white py-2 rounded-lg px-36">{title}</h2>
            <div className="space-y-2">
                {taskList[listName].map((taskName, index) => (
                    <TaskCard currentUsr={currentUsr} projectName={projectName} key={index} taskName={taskName} editMode={editMode} listName={listName} index={index}
                              deleteTaskHandler={() => deleteTaskHandler(listName, index)}/>
                ))}
                <button
                    className="w-full bg-green-700 text-white py-2 rounded-lg"
                    onClick={() => addTaskHandler(listName)}
                >
                    + 添加卡片
                </button>
            </div>
        </div>
    );
};


// eslint-disable-next-line react/prop-types
const TaskCard = ({taskName, editMode, listName, index, deleteTaskHandler, currentUsr, projectName}) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TASK,
        item: { taskName, listName, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [checkTaskCardIsOpen, setCheckTaskCardIsOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);

    const makeComment = () => {
        if(comment === "")
            return;
        let data = {
            usrName: currentUsr,
            projectName: projectName,
            taskName: taskName,
            comment: comment,
        }
        client.post(backendUrl + "/task/addComment", data).then(() => {setComment("");})
    }

    const getCommentList = () => {
        let data = {
            usrName: currentUsr,
            projectName: projectName,
            taskName: taskName,
        }
        client.post(backendUrl + "/task/getCommentList", data).then((response) => {
            setCommentList(response.data);
        })
    }

    return (
        //w-full bg-red-500 font-bold text-1xl text-white py-2 rounded-lg
        <div ref={drag}
             className={`bg-sky-700 p-4 rounded-lg shadow relative ${isDragging ? 'opacity-50' : ''}`}
        >
            <Modal
                isOpen={checkTaskCardIsOpen}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'black',
                        borderRadius: '12px',
                    },
                }}
            >
                <p className="text-2xl text-white">
                    评论区
                </p>
                <br/>
                <div className="flex-wrap justify-center text-cyan-600">
                    {commentList.map((commentContent, index) => (
                        <div key={index} style={{marginBottom: '10px'}}>
                            {commentContent}
                        </div>
                    ))}
                    <GetUsrInput setUsrInput={setComment} placeholder={"请输入评论"}/>
                    <br/>
                    <button onClick={() => {
                        makeComment();
                        setCheckTaskCardIsOpen(false);
                    }} className="mt-4 px-6 py-2 bg-green-500 text-white rounded">
                        发表评论
                    </button>
                    <button onClick={() => {
                        setComment("");
                        setCheckTaskCardIsOpen(false);
                    }} className="px-8 py-2 bg-red-500 text-white rounded">
                        取消
                    </button>
                </div>
            </Modal>

            {editMode && (
                <button
                    name="close"
                    className="absolute top-0 left-0 bg-red-500 text-white rounded-full flex items-center justify-center"
                    style={{width: '15px', height: '15px', fontSize: '8px'}}
                    onClick={deleteTaskHandler}
                >
                    x
                </button>
            )}
            <button
                className="text-2xl px-4 py-2 absolute top-0 right-0 text-white bg-sky-700 flex items-center justify-center"
                onClick={() => {
                    getCommentList();
                    setCheckTaskCardIsOpen(true);
                }}
            >
                {">"}
            </button>
            <p className="font-bold text-1xl">
                {taskName}
            </p>
        </div>
    );
};

export default TaskBoard;
