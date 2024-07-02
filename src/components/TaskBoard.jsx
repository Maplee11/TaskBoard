import React from 'react';
import { useState } from 'react'

const TaskBoard = () => {
    const [taskList, setTask] = useState({
        todo: [
            "规划本周的工作目标",
            "完成项目提案的草稿",
            "安排与客户的会议",
        ],
        undergoing: [
            "更新项目进度报告",
            "学习新的编程语言",
            "完成期末编程作业",
        ],
        done: [
            "购买办公耗材",
            "整理电子邮件收件箱",
            "准备团队建设活动",
        ],
    });

    const addTask = (listName, newTask) => {
        setTask((prevTasks) => ({
            ...prevTasks,
            [listName]: [...prevTasks[listName], newTask],
        }));
    };


    return (
        <div className="flex h-screen p-4 space-x-4">
            <Column taskList={taskList} title="计划中" tasks={"todo"}       addTaskHandler={addTask}/>
            <Column taskList={taskList} title="执行中" tasks={"undergoing"} addTaskHandler={addTask}/>
            <Column taskList={taskList} title="已完成" tasks={"done"}       addTaskHandler={addTask}/>
        </div>
    );
};

const Column = ({ taskList, title, tasks, addTaskHandler }) => {
    return (
        <div className="bg-gray-100 rounded-lg shadow p-4 inline-block min-w-max flex-grow">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="space-y-2">
                {taskList[tasks].map((task, index) => (
                    <TaskCard key={index} task={task} />
                ))}
                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg"
                    onClick={ () => {addTaskHandler(tasks, "HELLO")} }
                >
                    +添加卡片
                </button>
            </div>
        </div>
    );
};

const TaskCard = ({ task }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            {task}
        </div>
    );
};

export default TaskBoard;
