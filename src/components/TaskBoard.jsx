// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import GetUsrInput from "./GetUsrInput.jsx";

Modal.setAppElement('#root');

const TaskBoard = () => {
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

    // 回调函数会在依赖数组中的值发生变化时被触发
    useEffect(() => {
        if (!modalIsOpen && modalResolve.current) {
            modalResolve.current(newTask);
            modalResolve.current = null;
        }
    }, [modalIsOpen]);

    const addTask = async (listName) => {
        let newTask_ = await openModal();

        setTask((prevTasks) => ({
            ...prevTasks,
            [listName]: [...prevTasks[listName], newTask_],
        }));
    };

    return (
        <div className="flex h-screen p-4 space-x-4">
            <Column taskList={taskList} title="未开始" listName="todo" addTaskHandler={addTask} />
            <Column taskList={taskList} title="执行中" listName="undergoing" addTaskHandler={addTask} />
            <Column taskList={taskList} title="已完成" listName="done" addTaskHandler={addTask} />
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
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
                <GetUsrInput setUsrInput={setNewTask} />
                <br/>
                <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                    关闭
                </button>
                <button onClick={closeModal} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
                    保存
                </button>
            </Modal>
        </div>
    );
};

const Column = ({taskList, title, listName, addTaskHandler}) => {
    return (
        <div className="bg-gray-100 rounded-lg shadow p-4 inline-block min-w-max flex-grow">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="space-y-2">
                {taskList[listName].map((task, index) => (
                    <TaskCard key={index} task={task} />
                ))}
                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg"
                    onClick={() => addTaskHandler(listName)}
                >
                    +添加卡片
                </button>
            </div>
        </div>
    );
};

const TaskCard = ({ task }) => {
    return <div className="bg-white p-4 rounded-lg shadow">{task}</div>;
};

export default TaskBoard;
