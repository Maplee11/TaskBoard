import React, {useState, useRef, useEffect} from 'react';
import Modal from 'react-modal';
import GetUsrInput from "./GetUsrInput.jsx";
import axios from 'axios';

const client = axios.default;

// eslint-disable-next-line react/prop-types
const Project = ({setTask, backendUrl, taskList, projectName, setProjectName, setInitialize, isInitialized, currentUsr, setCurrentUsr}) => {
    const [switchWindowIsOpen, setSwitchWindowIsOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

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

    const tryLogin = () => {
        let data = {
            projectName: projectName,
        };
        client.post(backendUrl + "/accounts/login", data).then((response) => {
            if(response.data.message !== "fail"){
                setTask(response.data.taskList);
                setProjectName(projectName);
            }
        })
    }

    const logout = () => {
        setProjectName("");
        setTask({
            todo: [],
            undergoing: [],
            done: []
        });
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
                    },
                }}
            >
                <div className="justify-center">
                    <GetUsrInput setUsrInput={setNewProjectName} placeholder={"项目名"}/>
                    <br/>
                    <button onClick={() => {
                        setSwitchWindowIsOpen(false);
                        switchProject();
                    }} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
                        切换到该项目
                    </button>
                    <button onClick={() => {
                        setSwitchWindowIsOpen(false);
                        createNewProject();
                    }} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded">
                        创建项目
                    </button>
                    <button onClick={() => {
                        setSwitchWindowIsOpen(false)
                    }} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                        取消
                    </button>
                </div>
            </Modal>

            <button onClick={() => {
                setSwitchWindowIsOpen(true)
            }} className="bg-orange-500">
                切换项目
            </button>
            <br/>
            <p className={`text-lg font-semibold text-orange-500`}>
                当前项目: {projectName}
            </p>
        </div>
    )
}

export default Project;