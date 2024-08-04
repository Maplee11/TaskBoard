import React, {useState, useRef, useEffect} from 'react';
import Modal from 'react-modal';
import GetUsrInput from "./GetUsrInput.jsx";
import axios from 'axios';

const client = axios.default;

// eslint-disable-next-line react/prop-types
const Project = ({setTask, backendUrl, taskList, projectName, setProjectName, setInitialize, isInitialized, currentUsr, setCurrentUsr}) => {
    const [switchWindowIsOpen, setSwitchWindowIsOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [projectList, setProjectList] = useState(["DS", "ab"]);

    const downloadProjectList = () => {
        let data = {
            usrName: currentUsr,
        }
        client.post(backendUrl + "/project/download", data).then((response) => {
            setProjectList(response.data);
        })
    }

    const switchProject = () => {
        let data = {
            usrName: currentUsr,
            projectName: newProjectName,
        }
        client.post(backendUrl + "/project/load", data).then((response) => {
            setInitialize(false);
            setTask(response.data);
            setProjectName(newProjectName);
            setInitialize(true);
        })
    }

    const createNewProject = () => {
        let data = {
            usrName: currentUsr,
            projectName: newProjectName,
        }
        client.post(backendUrl + "/project/create", data).then(() => {
            setInitialize(false);
            setTask({
                todo: [],
                undergoing: [],
                done: []
            });
            setProjectName(newProjectName);
            setInitialize(true);
        })
    }

    return (
        <div>
            <Modal
                isOpen={switchWindowIsOpen}
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
                    已创建的项目:
                </p>
                <div className="justify-center text-cyan-600">
                    {projectList.map((project, index) => (
                        <div key={index} style={{marginBottom: '10px'}}>
                            {project}
                        </div>
                    ))}
                    <GetUsrInput setUsrInput={setNewProjectName} placeholder={"请输入目标项目名"}/>
                    <br/>
                    <button onClick={() => {
                        setSwitchWindowIsOpen(false);
                        createNewProject();
                    }} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded">
                        创建该项目
                    </button>
                    <button onClick={() => {
                        setSwitchWindowIsOpen(false);
                        switchProject();
                    }} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
                        切换到该项目
                    </button>
                    <button onClick={() => {
                        setSwitchWindowIsOpen(false)
                    }} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                        取消
                    </button>
                </div>
            </Modal>

            <button onClick={() => {
                setSwitchWindowIsOpen(true);
                downloadProjectList();
            }} className="bg-orange-500">
                项目设置
            </button>
            <br/>
            <p className={`font-semibold text-white`}>
                当前项目: {projectName}
            </p>
        </div>
    )
}

export default Project;