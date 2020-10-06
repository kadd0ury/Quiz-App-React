import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import questions from '../../questions.json'
import isEmpty from '../../utils/is-empty'
import M from 'materialize-css';
import correctNotifocation from '../../assets/audio/correct-answer.mp3';
import wrongNotification from '../../assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/audio/button-sound.mp3';
import classnames from 'classnames';


class Play extends React.Component {

    constructor() {
        super()
        this.state = {
            questions: questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberOfQuestions: 1,
            numberOfAnswerQuestion: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnwers: 0,
            wrongAnswers: 0,
            hint: 5,
            fiftyFifty: 2,
            usedFiftyFifty: false,
            time: {},
            previousRandomNumbers: [],
            isRed: false,
            nextButtonDisabled: false,
            PreviousButtonDisabled: true,


        };

        this.interval = null;
    }

    //cQ:currentQuestion,nQ :nextQuestion ,pQ:previousQuestion
    displayQuestions = (questions = this.state.questions, cQ, nQ, pQ) => {
        let { currentQuestionIndex } = this.state;

        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            cQ = this.state.questions[currentQuestionIndex];
            nQ = this.state.questions[currentQuestionIndex + 1];
            pQ = this.state.questions[currentQuestionIndex - 1];
            const answer = cQ.answer
            this.setState({
                currentQuestion: cQ,
                nextQuestion: nQ,
                previousQuestion: pQ,
                answer: answer,
                previousRandomNumbers: [],
                usedFiftyFifty: false
            }, () => {
                this.showOptions();
                this.handleDisabledButton()
            })
        }
    }

    componentDidMount() {
        this.displayQuestions();
        this.startTimer();
    }

    componentWillUnmount(){

        clearInterval(this.interval);
    }



    handleOptionClick = (e) => {

        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            setTimeout(() => {
                document.getElementById('correct-answer').play();
            }, 500)

            this.correctAnswer();
        }
        else {
            setTimeout(() => {
                document.getElementById('wrong-answer').play();
            }, 500)

            this.wrongAnswer();
        }
    }

    correctAnswer = () => {
        M.toast({
            html: 'Correct Answer !',
            classes: 'toast-valid',
            displayLength: 1500
        })
        this.setState(prevState => ({

            score: prevState.score + 1,
            correctAnwers: prevState.correctAnwers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnswerQuestion: prevState.numberOfAnswerQuestion + 1,
            numberOfQuestions: this.state.numberOfQuestions + 1

        }), () => {

            if (this.state.nextQuestion === undefined) {
                this.endGame();
            }
            else {
                this.displayQuestions(
                    this.state.questions,
                    this.state.currentQuestion,
                    this.state.nextQuestion,
                    this.state.previousQuestion
                );
            }
           
        })
    }

    wrongAnswer = () => {
        navigator.vibrate(1000);
        M.toast({
            html: 'Wrong Answer !',
            classes: 'toast-invalid',
            displayLength: 1500
        })
        this.setState(prevState => ({
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnswerQuestion: prevState.numberOfAnswerQuestion + 1,
            numberOfQuestions: this.state.numberOfQuestions + 1
        }), () => {

            if (this.state.nextQuestion === undefined) {
                this.endGame();
            }
            else {
                this.displayQuestions(
                    this.state.questions,
                    this.state.currentQuestion,
                    this.state.nextQuestion,
                    this.state.previousQuestion
                );
            }
        })
    }

    handleNextButton = () => {
        this.playButtonSound();
        if (this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1,
                numberOfQuestions: this.state.numberOfQuestions + 1
            }), () => {
                this.displayQuestions(
                    this.state.questions,
                    this.state.currentQuestion,
                    this.state.nextQuestion,
                    this.state.previousQuestion
                );
            });
        }
    }


    handlePreviousButton = () => {
        this.playButtonSound();
        if (this.state.previousQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1,
                numberOfQuestions: this.state.numberOfQuestions - 1
            }), () => {
                this.displayQuestions(
                    this.state.questions,
                    this.state.currentQuestion,
                    this.state.nextQuestion,
                    this.state.previousQuestion
                );
            });
        }





    }

    handleQuitButton = () => {
        this.playButtonSound();
        if (window.confirm('are you sure you want to quit ?')) {
            this.props.history.push('/');
        }
    }

    handleButtonClick = (e) => {
        switch (e.target.id) {

            default:
                break
            case 'next-button':
                this.handleNextButton();
                break;
            case 'previous-button':
                this.handlePreviousButton();
                break;
            case 'quit-button':
                this.handleQuitButton();
                break;
        }
    }
    playButtonSound = () => {
        document.getElementById('button-sound').play();
    }


    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));
        options.forEach(option => {
            option.style.visibility = 'visible';
        })

    }

    handleHintsClick = () => {
        if (this.state.hint > 0) {
            const options = Array.from(document.querySelectorAll('.option'));
            let indexAnswer;
            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexAnswer = index;
                }
            });

            while (true) {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if (index === randomNumber) {
                            option.style.visibility = 'hidden';
                            this.setState((prevState) => ({
                                hint: prevState.hint - 1,
                                previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                            }));
                        }
                    })
                    break;
                }
                if (this.state.previousRandomNumbers.length >= 3) break;
            }

        }

    }


    handleFiftyFiftyClick = () => {

        if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {

            const { answer } = this.state;
            let indexAnswers = [];
            let indexAnswer;
            const options = Array.from(document.querySelectorAll('.option'));
            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === answer.toLowerCase()) {
                    indexAnswer = index;
                }
            })
            while (indexAnswers.length < 2) {
                const choice = Math.floor(Math.random() * 4);
                if (choice !== indexAnswer && !indexAnswers.includes(choice)) {
                    indexAnswers.push(choice);
                }
            }
            options[indexAnswers[0]].style.visibility = 'hidden';
            options[indexAnswers[1]].style.visibility = 'hidden';
            this.setState({
                fiftyFifty: this.state.fiftyFifty - 1,
                usedFiftyFifty: true
            })

        }


    }


    startTimer = () => {
        const countDown = Date.now() + 60000;
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = countDown - now;
            const minutes = Math.floor(distance / (1000 * 60));
            const seconds = Math.floor(distance / 1000);

            if (distance < 0) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        mminutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.endGame();
                })
            }
            else {
                this.setState({
                    time: {
                        minutes,
                        seconds
                    }
                })
            }
            if (seconds < 10 && seconds >=0) {
                document.getElementById('red').style.color = '#DC143C';
            }

        }, 1000)
    }


    handleDisabledButton = () => {

        if (this.state.previousQuestion === undefined || this.state.currentQuestionIndex === 0) {
            this.setState({
                PreviousButtonDisabled: true
            })
        }
        else { this.setState({ PreviousButtonDisabled: false }) }

        if (this.state.nextQuestion === undefined) {
            this.setState({
                nextButtonDisabled: true
            })
        }
        else { this.setState({ nextButtonDisabled: false }) }
    }

    endGame = () => {
        alert('Quiz ended !');
        const playerStatus = {
            score: this.state.score,
            numberOfQuestions: this.state.questions.length,
            numberOfAnswerQuestion: this.state.numberOfAnswerQuestion,
            correctAnwer: this.state.correctAnwers,
            wrongAnswer: this.state.wrongAnswers,
            fiftyUsed: 2 - this.state.fiftyFifty,
            hintUsed: 5 - this.state.hint
        };
        console.log(playerStatus);
        setTimeout(() => {
            this.props.history.push('/Quiz/summary',playerStatus);
        }, 1000)
    }
    render() {
        const { currentQuestion, hint } = this.state
        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <Fragment>
                    <audio id="correct-answer" src={correctNotifocation}></audio>
                    <audio id="wrong-answer" src={wrongNotification}></audio>
                    <audio id="button-sound" src={buttonSound}></audio>
                </Fragment>
                <div className="questions">
                    <h2>Quiz Mode</h2>
                    <div className="lifeline-container">
                        <p>

                            <span onClick={this.handleFiftyFiftyClick} className="lifeline-icon"><i className="fa fa-hand-peace-o" aria-hidden="true"></i></span>
                            <span className="lifeline">{this.state.fiftyFifty}</span>
                        </p>

                        <p>
                            <span style={{ position: "relative", left: "-6px" }} className="lifeline">{hint}</span>
                            <span id="option" onClick={this.handleHintsClick} className="lifeline-icon"><i className="fa fa-lightbulb-o" aria-hidden="true"></i></span>

                        </p>
                    </div>

                    <div>
                        <p>

                            <span className="left">{this.state.numberOfQuestions} of {this.state.questions.length} </span>
                            <span id="red" className="right lifeline-icon">{this.state.time.minutes}:{this.state.time.seconds}<span><i style={{ position: "relative", left: "4px" }} className="fa fa-clock-o" aria-hidden="true"></i></span></span>
                        </p>
                    </div>

                    <h5>{currentQuestion.question}?</h5>
                    <div className="options-container">

                        <p id={currentQuestion.optionA} onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                        <p id={currentQuestion.optionB} onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p>

                    </div>
                    <div className="options-container">
                        <p id={currentQuestion.optionC} onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                        <p id={currentQuestion.optionD} onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p>


                    </div>

                    <div className="button-container">
                        <button
                            className={classnames('', { 'disable': this.state.PreviousButtonDisabled })}
                            id="previous-button"
                            onClick={this.handleButtonClick}
                        >Previous
                         </button>
                        <button
                            className={classnames('', { 'disable': this.state.nextButtonDisabled })}
                            id="next-button"
                            onClick={this.handleButtonClick} >
                            Next
                            </button>
                        <button id="quit-button" onClick={this.handleButtonClick} >Quit</button>
                    </div>

                </div>
            </Fragment>
        )
    }
}
export default Play