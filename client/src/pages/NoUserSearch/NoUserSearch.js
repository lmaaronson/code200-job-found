import React, { Component } from "react";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { Input, FormBtn } from "../../components/Form";
import Modal from 'react-modal';
import "./NoUserSearch.css"

const userModalStyles = {
    content: {
        width: 'auto',
        bottom: 'auto',
        margin: 'auto',
    }
};

const loadingModalStyles = {
    content: {
        width: '10%',
        top: '40%',
        bottom: 'auto',
        margin: 'auto',
        padding: 'auto'
    }
};

class NoUserSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            jobSearch: "",
            toggled: [],
            login_modalIsOpen: false,
            register_modalIsOpen: false,
            email: "",
            password: "",
            confirmPassword: "",
            success_modalIsOpen: false,
            failure_modalIsOpen: false,
            passfailure_modalIsOpen: false,
            loginfailure_modalIsOpen: false,
            loading_modalIsOpen: false
        };
        this.references = []
        this.login_openModal = this.login_openModal.bind(this);
        this.login_closeModal = this.login_closeModal.bind(this);
        this.register_openModal = this.register_openModal.bind(this);
        this.register_closeModal = this.register_closeModal.bind(this);
        this.success_openModal = this.success_openModal.bind(this);
        this.success_closeModal = this.success_closeModal.bind(this);
        this.failure_openModal = this.failure_openModal.bind(this);
        this.failure_closeModal = this.failure_closeModal.bind(this);
        this.passfailure_openModal = this.passfailure_openModal.bind(this);
        this.passfailure_closeModal = this.passfailure_closeModal.bind(this);
        this.loginfailure_openModal = this.loginfailure_openModal.bind(this)
        this.loginfailure_closeModal = this.loginfailure_closeModal.bind(this);
        this.loading_openModal = this.loading_openModal.bind(this)
        this.loading_closeModal = this.loading_closeModal.bind(this);
    }

    componentDidMount() {
        this.loading_openModal()
        API.isLoggedIn().then(function (res) {
            window.location = "/search"
        }).catch(this.loading_closeModal)
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    login_openModal(event) {
        if (event) {
            event.preventDefault()
        }
        this.setState({
            login_modalIsOpen: true,
            email: "",
            password: "",
            confirmPassword: ""
        });
    }

    loading_openModal(event) {
        if (event) {
            event.preventDefault()
        }
        this.setState({
            loading_modalIsOpen: true,
        });
    }

    register_openModal(event) {
        if (event) {
            event.preventDefault()
        }
        this.setState({
            register_modalIsOpen: true,
            email: "",
            password: "",
            confirmPassword: ""
        });
    }

    success_openModal(event) {
        if (event) {
            event.preventDefault()
        }
        this.setState({
            success_modalIsOpen: true,
            email: "",
            password: "",
            confirmPassword: ""
        });
    }

    failure_openModal(event) {
        if (event) {
            event.preventDefault()
        }
        this.setState({
            failure_modalIsOpen: true,
            password: "",
            confirmPassword: ""
        });
    }

    passfailure_openModal(event) {
        if (event) {
            event.preventDefault()
        }
        this.setState({
            passfailure_modalIsOpen: true,
            password: "",
            confirmPassword: ""
        });
    }

    loginfailure_openModal(event) {
        if (event) {
            event.preventDefault()
        }
        this.setState({
            loginfailure_modalIsOpen: true,
            email: "",
            password: "",
            confirmPassword: ""
        });
    }

    login_closeModal() {
        this.setState({ login_modalIsOpen: false });
    }


    register_closeModal() {
        this.setState({ register_modalIsOpen: false });
    }

    success_closeModal() {
        this.setState({ success_modalIsOpen: false });
    }

    failure_closeModal() {
        this.setState({ failure_modalIsOpen: false });
    }

    passfailure_closeModal() {
        this.setState({ passfailure_modalIsOpen: false });
    }

    loginfailure_closeModal() {
        this.setState({ loginfailure_modalIsOpen: false });
    }

    loading_closeModal() {
        this.setState({ loading_modalIsOpen: false });
    }

    save = (event, id) => {
        event.preventDefault();
        API.saveJob(id)
            .then(res => {
                this.get()
            })
            .catch(err => console.log(err));
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
        console.log(newArr)
        this.setState({ toggled: newArr }, function () { console.log(this.state.toggled[i]) })
    }

    goto = (event, url) => {
        event.preventDefault();
        window.open(url)
    }

    noUserSearch = (event) => {
        event.preventDefault();
        this.loading_openModal(false)
        API.noUserSearch(this.state.jobSearch).then(res => {
            console.log("it hit")
            var jobs = res.data
            var toggled = []
            for (var i = 0; i < jobs.length; i++) {
                toggled.push("collapsed")
                var ref = React.createRef()
                this.references.push(ref)
            }
            this.setState({ jobs: jobs, toggled: toggled }, this.loading_closeModal)
        })
    }

    logIn = event => {
        // When the form is submitted, prevent its default behavior, get recipes update the recipes state
        if (event) {
            event.preventDefault();
        }
        API.logIn({ email: this.state.email, password: this.state.password }).then(res => {
            if (res.data === "fail") {
                this.loginfailure_openModal(event)
            } else {
                if (this.state.jobSearch === "") {
                    window.location = "/search"
                } else {
                    API.submitSearch(this.state.jobSearch)
                        .then(res => {
                            window.location = "/search"
                        })
                }
            }
        })
    };

    register = event => {
        // When the form is submitted, prevent its default behavior, get recipes update the recipes state
        event.preventDefault();
        if (this.state.password === this.state.confirmPassword) {
            API.register({ email: this.state.email, password: this.state.password }).then((res) => {
                console.log(res)
                if (res.data === "fail") {
                    this.failure_openModal(false)
                } else {
                    this.register_closeModal(false)
                    this.success_openModal(false)
                    this.logIn(false)
                }
            })
        } else {
            this.passfailure_openModal(false)
        }
    };
    render() {
        return (<div>
            <div className="navi">
                <div className="navi-item2" onClick={(event) => this.login_openModal(event)}>
                    Log In
                </div>
                <div className="navi-item2" onClick={(event) => this.register_openModal(event)}>
                    Register
                </div>
            </div>
            <div className="main">
                <br />
                <form>
                    <br />
                    <div className="searchField">
                        <Input name="jobSearch"
                            value={this.state.jobSearch}
                            onChange={this.handleInputChange}
                            placeholder="Search" />
                    </div>
                    <div className="submitSearch">
                        <FormBtn
                            onClick={this.noUserSearch}
                            type="success"
                            className="input-lg">
                            Search
                    </FormBtn>
                    </div>
                </form>
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
                                    <Col size="md-4"><button type="button" className="btn btn-outline-primary moreInfo" onClick={((event) => this.toggle(event, i))}>More</button></Col>
                                    <Col size="md-4"><button type="button" className="btn btn-outline-secondary jobLink" onClick={((event) => this.goto(event, job.apply_url))}>Link</button></Col>
                                    <Col size="md-4"><button type="button" className="btn btn-outline-success saveJob" onClick={((event) => this.login_openModal(event))}>Save</button></Col>
                                </Row>
                            </Container>
                        </div>
                    );
                })}
            </div>
            <Modal
                isOpen={this.state.login_modalIsOpen}
                onRequestClose={this.login_closeModal}
                style={userModalStyles}>
                <div className="modalHeader">
                    <h1>200 Job Found</h1>
                    <strong> You need to log in if you want to save or take notes on any jobs!</strong>
                </div>
                <br />
                <form>
                    <Input name="email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        placeholder="E-mail Address" />
                    <Input name="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        type="password"
                        placeholder="Password" />
                    <FormBtn
                        onClick={this.logIn}
                        type="success"
                        className="input-lg login">
                        Log In
                    </FormBtn>
                </form>
            </Modal>
            <Modal
                isOpen={this.state.register_modalIsOpen}
                onRequestClose={this.register_closeModal}
                style={userModalStyles}>
                <div className="modalHeader">
                    <h1>200 Job Found</h1>
                    <strong> You need to sign up if you want to save or take notes on any jobs!</strong>
                </div>
                <br />
                <form>
                    <Input name="email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        placeholder="E-mail Address"
                    />
                    <Input name="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        type="password"
                        placeholder="Password"
                    />
                    <Input name="confirmPassword"
                        value={this.state.confirmPassword}
                        onChange={this.handleInputChange}
                        type="password"
                        placeholder="Confirm Password"
                    />
                    <FormBtn
                        onClick={this.register}
                        type="success"
                        className="input-lg login">
                        Register
                    </FormBtn>
                </form>
            </Modal>
            <Modal
                isOpen={this.state.failure_modalIsOpen}
                onRequestClose={this.failure_closeModal}
                style={userModalStyles}>
                You either entered an e-mail that is not valid or is already associated with an account.<br />
                Please try again.
            </Modal>
            <Modal
                isOpen={this.state.passfailure_modalIsOpen}
                onRequestClose={this.passfailure_closeModal}
                style={userModalStyles}>
                Your passwords did not match.<br />
                Please try again.
            </Modal>
            <Modal
                isOpen={this.state.success_modalIsOpen}
                onRequestClose={this.success_closeModal}
                style={userModalStyles}>
                Account Created!
            </Modal>
            <Modal
                isOpen={this.state.loginfailure_modalIsOpen}
                onRequestClose={this.loginfailure_closeModal}
                style={userModalStyles}>
                Either Username, or the password, or both were incorrect.
                Please try again.
            </Modal>
            <Modal
                isOpen={this.state.loading_modalIsOpen}
                onRequestClose={this.loading_closeModal}
                style={loadingModalStyles}>
                <img src="loadingAnimation.gif" className="loadingImg" alt="Loading animation failed to load." />
            </Modal>
        </div>
        );
    }
}


export default NoUserSearch;
