import React, {useState, useRef, useEffect} from 'react';
import Modal from 'react-modal';
import GetUsrInput from "./GetUsrInput.jsx";
import axios from 'axios';

const client = axios.default;

// eslint-disable-next-line react/prop-types
const Accounts = ({setProjectName, setLogged, setTask, backendUrl, taskList, setInitialize, isInitialized, currentUsr, setCurrentUsr, projectName}) => {
    const [loginWindowIsOpen, setLoginWindowIsOpen] = useState(false);
    const [usrName, setUsrName] = useState("");
    const [password, setPassword] = useState("");

    const saveUsrTask = () => {
        let data = {
            taskList: taskList,
            usrName: currentUsr,
            projectName: projectName,
        }
        client.post(backendUrl + "/task/save", data);
    }

    const createNewAccount = () => {
        let data = {
            usrName: usrName,
            password: password
        };
        client.post(backendUrl + "/accounts/create", data).then((response) => {
            setTask(response.data);
            setInitialize(true);
            setCurrentUsr(usrName);
            setLogged(true);
        })
    }

    const tryLogin = () => {
        let data = {
            usrName: usrName,
            password: password
        };
        client.post(backendUrl + "/accounts/login", data).then((response) => {
            if(response.data.message !== "fail"){
                setTask(response.data.taskList);
                setCurrentUsr(usrName);
                setInitialize(true);
                setLogged(true);
            }
        })
    }

    async function logout() {
        setInitialize(false);

        setCurrentUsr("");
        setUsrName("");
        setPassword("");
        setLogged(false);
        setProjectName("示例项目");

        await new Promise(resolve => setTimeout(resolve, 0));

        console.log(isInitialized);
        setTask({
            todo: [],
            undergoing: [],
            done: []
        });
    }

    useEffect(() => {
        if(isInitialized === true){
            saveUsrTask();
        }
    }, [taskList]);

    return (
        <div>
            <Modal
                isOpen={loginWindowIsOpen}
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
                    <GetUsrInput setUsrInput={setUsrName} placeholder={"用户名"}/>
                    <br/>
                    <br/>
                    <GetUsrInput setUsrInput={setPassword} placeholder={"密码"}/>
                    <br/>
                    <button onClick={() => {
                        setLoginWindowIsOpen(false);
                        tryLogin();
                    }} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
                        登录
                    </button>
                    <button onClick={() => {
                        setLoginWindowIsOpen(false);
                        createNewAccount();
                    }} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded">
                        注册
                    </button>
                    <button onClick={() => {
                        setLoginWindowIsOpen(false)
                    }} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                        取消
                    </button>
                </div>
            </Modal>

            {((currentUsr === "") && <button onClick={() => {
                setLoginWindowIsOpen(true)
            }} className="bg-green-800">
                登录
            </button>)}
            {(currentUsr !== "") && (<button onClick={logout} className="bg-red-800">
                退出登录
            </button>)}
            <br/>
            <p className={`font-semibold ${currentUsr === "" ? "text-red-800" : "text-white"}`}>
                当前用户: {currentUsr === "" ? "游客" : currentUsr}
            </p>
        </div>
    )
}

export default Accounts;