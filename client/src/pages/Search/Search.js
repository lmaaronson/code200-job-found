import React, { Component } from "react";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { Input, FormBtn } from "../../components/Form";
import Modal from 'react-modal';
import "./Search.css"

const customStyles = {
    content: {
        width: '10%',
        top: '40%',
        bottom: 'auto',
        margin: 'auto',
        padding: 'auto'
    }
};

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            jobSearch: "",
            toggled: [],
            loading_modalIsOpen: false
        };
        this.references = []
        this.loading_modalOpen = this.loading_modalOpen.bind(this)
        this.loading_modalClose = this.loading_modalClose.bind(this)
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
        this.get()
    }

    loading_modalClose() {
        this.setState({ loading_modalIsOpen: false })
    }

    loading_modalOpen() {
        setTimeout(this.loading_modalClose, 10000)
        this.setState({ loading_modalIsOpen: true })
    }


    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    search = event => {
        event.preventDefault();
        this.loading_modalOpen()
        API.submitSearch(this.state.jobSearch)
            .then(res => {
                this.get()
            })
            .catch(err => console.log(err));
    }

    get = () => {
        console.log("!")
        API.getSearch().then(res => {
            var jobs = res.data.results
            var toggled = []
            for (var i = 0; i < jobs.length; i++) {
                toggled.push("collapsed")
                var ref = React.createRef()
                this.references.push(ref)
            }
            this.setState({ jobs: jobs, toggled: toggled }, function () {
                this.loading_modalClose()
            })
        })
    }

    save = (event, id) => {
        event.preventDefault();
        this.loading_modalOpen()
        API.saveJob(id)
            .then(res => {
                this.get()
            })
            .catch(err => console.log(err));
    };

    logout = event => {
        event.preventDefault()
        API.logOut().then(window.location.assign('/'))
    }

    toggle = (event, i) => {
        event.preventDefault()
        var ref = this.references[i].current.offsetTop
        var newArr = []
        console.log(this.state.jobs[i])
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

    goto = (event, url, newTab) => {
        event.preventDefault();
        if (newTab) {
            window.open(url)
        } else {
            window.location.assign(url)
        }
    }

    render() {
        return (
            <div>
                <div className="navi">
                    <div className="navi-item">
                        Search
                    </div>
                    <div className="navi-item" onClick={(event) => this.goto(event, '/saved', false)}>
                        Saved
                    </div>
                    <div className="navi-item" onClick={(event) => this.logout(event)}>
                        Logout
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
                                onClick={this.search}
                                type="success"
                                className="input-lg">
                                Search
                    </FormBtn>
                        </div>
                    </form>
                    <br />
                    <br />
                    {/* <span onClick={((event) => this.logout(event))}>log out</span> */}
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
                                        <Col size="md-4"><button type="button" className="btn btn-outline-secondary jobLink" onClick={((event) => this.goto(event, job.apply_url, true))}>Link</button></Col>
                                        <Col size="md-4"><button type="button" className="btn btn-outline-success saveJob" onClick={((event) => this.save(event, job.id))}>Save</button></Col>
                                    </Row>
                                </Container>
                            </div>
                        );
                    })}
                </div>
                <Modal
                    isOpen={this.state.loading_modalIsOpen}
                    // onAfterOpen={this.login_afterOpenModal}
                    onRequestClose={this.loading_closeModal}
                    style={customStyles}>
                    <img src="loadingAnimation.gif" className="loadingImg" alt="Loading animation failed to load." />
                </Modal>
            </div>
        );
    }
}


export default Search;
