import React from 'react';

const tasks_todo = [
    "规划本周的工作目标",
    "完成项目提案的草稿",
    "安排与客户的会议",
];

const tasks_undergoing = [
    "更新项目进度报告",
    "学习新的编程语言",
    "完成期末编程作业",
];

const tasks_done = [
    "购买办公耗材",
    "整理电子邮件收件箱",
    "准备团队建设活动",
];

const TaskBoard = () => {
    return (
        <div className="flex h-screen p-4 space-x-4">
            <Column title="计划中" tasks={tasks_todo} />
            <Column title="执行中" tasks={tasks_undergoing} />
            <Column title="已完成" tasks={tasks_done} />
        </div>
    );
};

const Column = ({ title, tasks }) => {
    return (
        <div className="bg-gray-100 rounded-lg shadow p-4 inline-block min-w-max">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="space-y-2">
                {tasks.map((task, index) => (
                    <TaskCard key={index} task={task} />
                ))}
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg">+添加卡片</button>
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
