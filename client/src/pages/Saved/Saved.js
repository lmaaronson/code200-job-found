import React, { Component } from "react";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { Input, FormBtn } from "../../components/Form";
import Modal from 'react-modal';
import "./Saved.css"

const customStyles = {
    content: {
        top: '10%',
        width: 'auto',
        bottom: '10%',
        margin: 'auto',
    }
};

const loadingStyles = {
    content: {
        width: '10%',
        top: '40%',
        bottom: 'auto',
        margin: 'auto',
        padding: 'auto'
    }
};


Modal.setAppElement('#root')

class Saved extends Component {

    constructor(props) {
        super(props);

        this.state = {
            jobs: [],
            modalIsOpen: false,
            modalTasks: [],
            modalId: 0,
            modalDescription: "",
            task: "",
            toggled: [],
            loading_modalIsOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.loading_modalOpen = this.loading_modalOpen.bind(this)
        this.loading_modalClose = this.loading_modalClose.bind(this)
        this.references = []

        this.jobInfoStyle = {
        }
        this.allTasksStyle = {
        }
        this.modalView = "dual"
        this.toggleInfo = this.toggleInfo.bind(this)
        this.toggleTasks = this.toggleTasks.bind(this)
        this.toggleSplit = this.toggleSplit.bind(this)
        this.allTasksStyle = {
            width: "50%",
            display: "block"
        }

        this.jobInfoStyle = {
            width: "50%",
            display: "block"
        }
    }

    loading_modalClose() {
        this.setState({ loading_modalIsOpen: false })
    }

    loading_modalOpen() {
        setTimeout(this.loading_modalClose, 10000)
        this.setState({ loading_modalIsOpen: true })
    }

    toggleTasks(event) {
        if (event) {
            event.preventDefault()
        }

        this.jobInfoStyle = {
            display: 'none'
        }
        this.allTasksStyle = {
            display: 'block',
            width: '100%'
        }
        this.modalView = 'tasks'
        this.openModal(event)
    }

    toggleInfo(event) {
        if (event) {
            event.preventDefault()
        }
        this.allTasksStyle = {
            display: 'none'
        }
        this.jobInfoStyle = {
            display: 'block',
            width: '100%'
        }
        this.modalView = 'info'
        this.openModal(event)
    }

    toggleSplit(event) {
        if (event) {
            event.preventDefault()
        }
        this.allTasksStyle = {
            width: "50%",
            display: "block"
        }

        this.jobInfoStyle = {
            width: "50%",
            display: "block"
        }
        this.modalView = "dual"
        this.openModal(event)
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
    }

    closeModal() {
        this.setState({ modalIsOpen: false, modalTasks: [], modalId: -1 });
    }

    componentDidMount() {
        this.loading_modalOpen()
        API.isntLoggedIn().then(res => {
            console.log(res)
            if (res.data === true) {
                window.location = "/"
            }
            this.loading_modalClose()
        })
        this.getSaved()
    }

    getSaved = () => {
        API.getSaved().then(res => {
            var jobs = res.data.results
            var toggled = []
            for (var i = 0; i < jobs.length; i++) {
                toggled.push("collapsed")
                var ref = React.createRef()
                this.references.push(ref)
            }
            this.setState({ jobs: jobs, toggled: toggled }, this.loading_modalClose)
        })
    }

    getTasks = (event, id, desc) => {
        event.preventDefault()
        this.setState({ modalId: id, modalDescription: desc })
        API.getTasks(id).then(res => {
            var tasks = res.data
            this.loading_modalClose()
            this.setState({ modalTasks: tasks },
                this.openModal())
        })
    }

    addTask = (event, id, task) => {
        event.preventDefault()
        this.loading_modalOpen()
        this.setState({ task: "" })
        API.addTask(id, task).then(this.getTasks(event, id, this.state.modalDescription))

    }

    removeTask = (event, id, job) => {
        event.preventDefault()
        this.loading_modalOpen()
        API.removeTask(id).then(this.getTasks(event, job, this.state.modalDescription))
    }

    delete = (event, id) => {
        event.preventDefault();
        this.loading_modalOpen()
        API.deleteJob(id)
            .then(res => {
                this.getSaved()
            })
            .catch(err => console.log(err));
    };

    logout = event => {
        event.preventDefault()
        API.logOut().then(window.location.assign('/'))
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    toggle = (event, i) => {
        event.preventDefault()
        var ref = this.references[i].current.offsetTop
        var newArr = []
        this.state.toggled.forEach(function (toggle, ind) {
            if (i === ind) {
                if (toggle === "collapsed") {
                    toggle = "expanded"
                } else {
                    toggle = "collapsed"
                    window.scrollTo(0, ref)
                }
            }
            newArr.push(toggle)
        })
        this.setState({ toggled: newArr })
    }

    goto = (event, url, newTab) => {
        event.preventDefault();
        if (newTab) {
            window.open(url)
        } else {
            window.location.assign(url)
        }
    }

    // setRef = () => {
    //     var ref = React.createRef()
    //     this.references.push(ref)
    // }

    render() {
        return (
            <div>
                <div className="navi">
                    <div className="navi-item" onClick={(event) => this.goto(event, '/search', false)}>
                        Search
                    </div>
                    <div className="navi-item">
                        Saved
                    </div>
                    <div className="navi-item" onClick={(event) => this.logout(event)}>
                        Logout
                    </div>
                </div>
                <div className="main">
                    <br />
                    <br />
                    {this.state.jobs.map((job, i) => {
                        return (
                            <div className="listing" key={i} ref={this.references[i]}>
                                <Container>
                                    <Row><Col size="md-12"><h3>{job.title.toString()}</h3><br /></Col></Row>
                                    <Row>
                                        <div className={this.state.toggled[i]} dangerouslySetInnerHTML={{ __html: job.description }}>
                                        </div>
                                    </Row>
                                    <Row>
                                        <Col size="md-3"><button type="button" className="btn btn-outline-primary moreInfo" onClick={((event) => this.toggle(event, i))}>More</button></Col>
                                        <Col size="md-3"><button type="button" className="btn btn-outline-info getTasks" onClick={((event) => this.getTasks(event, job.id, job.description))}>Tasks</button></Col>
                                        <Col size="md-3"><button type="button" className="btn btn-outline-secondary jobLink" onClick={((event) => this.goto(event, job.apply_url, true))}>Link</button></Col>
                                        <Col size="md-3"><button type="button" className="btn btn-outline-danger deleteJob" onClick={((event) => this.delete(event, job.id))}>Delete</button></Col>
                                    </Row>
                                </Container>
                            </div>
                        );
                    })}
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        <div className="taskWindow">
                            <div className="jobInfo" style={this.jobInfoStyle} dangerouslySetInnerHTML={{ __html: this.state.modalDescription }}></div>
                            <div className="allTasks" style={this.allTasksStyle}>
                                {this.state.modalTasks.map((task, i) => {
                                    return (
                                        <div className="task" key={i}>
                                            <Row>
                                                <Col size="md-11">
                                                    <p>{task.task}</p>
                                                </Col>
                                                <Col size="md-1">
                                                    <button type="button" className="btn btn-outline-danger" onClick={(event) => this.removeTask(event, task.id, task.job)}>Remove</button>
                                                </Col>
                                            </Row>
                                            <hr />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="taskInput">
                                <Row>
                                    <button type="button" className="btn btn-outline-info viewInfo" onClick={(event) => this.toggleInfo(event)}>Job Info</button>
                                    <button type="button" className="btn btn-outline-info viewSplit" onClick={(event) => this.toggleSplit(event)}>Split</button>
                                    <button type="button" className="btn btn-outline-info viewTasks" onClick={(event) => this.toggleTasks(event)}>Tasks</button>
                                </Row>
                                <Row>
                                    <div className="taskFieldContainer">
                                        <Input name="task"
                                            value={this.state.task}
                                            onChange={this.handleInputChange}
                                            placeholder="Task"
                                            className="taskField"
                                        />
                                    </div>
                                    <div className="submitTaskContainer">
                                        <FormBtn
                                            onClick={(event) => this.addTask(event, this.state.modalId, this.state.task)}
                                            type="success"
                                            className="input-lg submitTask">
                                            Add
                                    </FormBtn>
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </Modal>
                </div>
                <Modal
                    isOpen={this.state.loading_modalIsOpen}
                    onRequestClose={this.loading_closeModal}
                    style={loadingStyles}>
                    <img src="loadingAnimation.gif" className="loadingImg" alt="Loading animation failed to load." />
                </Modal>
            </div>
        );
    }
}


export default Saved;
