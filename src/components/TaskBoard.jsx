import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import GetUsrInput from "./GetUsrInput.jsx";
import { useDrag, useDrop } from 'react-dnd';

Modal.setAppElement('#root');

const ItemTypes = {
    TASK: 'task',
};

const TaskBoard = () => {
    const [editMode, setEditMode] = useState(false);

    return (
        <div>
            <button
                onClick={() => setEditMode(!editMode)}
                className="mt-4 px-4 py-2 bg-blue-400 text-white rounded"
            >
                {editMode ? "退出编辑" : "编辑"}
            </button>
            <TasksArea editMode={editMode} />
        </div>
    );
}

const TasksArea = ({ editMode }) => {
    const [taskList, setTask] = useState({
        todo: [
            '规划本周的工作目标',
            '完成项目提案的草稿',
            '安排与客户的会议',
        ],
        undergoing: [
            '更新项目进度报告',
            '学习新的编程语言',
            '完成期末编程作业',
        ],
        done: [
            '购买办公耗材',
            '整理电子邮件收件箱',
            '准备团队建设活动',
        ],
    });

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

    const save2newtask = () => {
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
        console.log(`Task ${listName}[${taskIndex}] deleted`);
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
            <Column taskList={taskList} title="未开始" listName="todo" addTaskHandler={addTask} editMode={editMode} deleteTaskHandler={deleteTask} moveTaskHandler={moveTask} />
            <Column taskList={taskList} title="执行中" listName="undergoing" addTaskHandler={addTask} editMode={editMode} deleteTaskHandler={deleteTask} moveTaskHandler={moveTask} />
            <Column taskList={taskList} title="已完成" listName="done" addTaskHandler={addTask} editMode={editMode} deleteTaskHandler={deleteTask} moveTaskHandler={moveTask} />

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
                    },
                }}
            >
                <div className="flex flex-wrap justify-center">
                    <GetUsrInput setUsrInput={setNewTask} />
                    <br />
                    <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                        取消
                    </button>
                    <button onClick={() => {
                        save2newtask();
                        closeModal();
                    }} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
                        保存
                    </button>
                </div>
            </Modal>
        </div>
    );
};

const Column = ({ taskList, title, listName, addTaskHandler, editMode, deleteTaskHandler, moveTaskHandler }) => {
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
        <div ref={drop} className="bg-gray-100 rounded-lg shadow p-4 inline-block min-w-max flex-grow">
            <h2 className="w-full bg-red-500 font-bold text-1xl text-white py-2 rounded-lg">{title}</h2>
            <div className="space-y-2">
                {taskList[listName].map((taskName, index) => (
                    <TaskCard key={index} taskName={taskName} editMode={editMode} listName={listName} index={index} deleteTaskHandler={() => deleteTaskHandler(listName, index)} />
                ))}
                <button
                    className="w-full bg-green-500 text-white py-2 rounded-lg"
                    onClick={() => addTaskHandler(listName)}
                >
                    + 添加卡片
                </button>
            </div>
        </div>
    );
};


const TaskCard = ({ taskName, editMode, listName, index, deleteTaskHandler }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TASK,
        item: { taskName, listName, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag} className={`bg-white p-4 rounded-lg shadow relative ${isDragging ? 'opacity-50' : ''}`}>
            {editMode && (
                <button
                    name="close"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full flex items-center justify-center"
                    style={{ width: '15px', height: '15px', fontSize: '8px' }}
                    onClick={deleteTaskHandler}
                >
                    x
                </button>
            )}
            {taskName}
        </div>
    );
};

export default TaskBoard;
