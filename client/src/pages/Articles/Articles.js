import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import APINYT from "../../utils/APINYT"
import DeleteBtn from "../../components/DeleteBtn";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, TextArea, FormBtn } from "../../components/Form";

class Articles extends Component {
  state = {
    searchterm: "",
    numberofrecords: 5,
    startyear: "",
    endyear: "",
    articles: [],
    savedarticles: [],
    biodiversity: [],
    wordtoguess: "",
    displayedword: "",
    // This is the array of user entries
    userGuesses: [],
    userGuessesString: "",
    lives: 5,
    wins: 0,
    losses: 0,
  };





  //https://stackoverflow.com/questions/10710345/finding-all-indexes-of-a-specified-character-within-a-string

  // creating a keystroke function
  _handleKeyDown = (event) => {
    let alreadyGuessed = this.state.userGuesses;
    let userGuess = event.key.toLowerCase();
    console.log(userGuess);
    let BACKSPACE = 8;

    // Selection of valid characters for the game
    let characSet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
      'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
      'w', 'x', 'y', 'z', " "]

    // This builds the array of userGuesses

    // First option:Check if it was the backspace key pressed
    if (userGuess === 'backspace') {
      this.setState({ userGuesses: [] });
      console.log(alreadyGuessed);
      // Second option: has the user already selected this character?
    } else {
      if (alreadyGuessed.indexOf(userGuess) >= 0) {
        console.log("Repeated entry, entry ignored");
        // Third option: is the character valid (in characSet)?
      } else if (characSet.indexOf(userGuess) === -1) {
        console.log("Invalid character entry!")
        // Fourth option: everything is valid and the character selected gets pushed
        // to an array logging the choice and checking if it is in the wordtoguess.
      } else {
        alreadyGuessed.push(userGuess);
        console.log(alreadyGuessed);
        this.checkAgainstWord(userGuess);
        this.switchOutUnderscores(userGuess);
      }
    }

  }

  checkAgainstWord = (userGuess) => {
    if (this.state.wordtoguess.indexOf(userGuess) == -1) {
      console.log('The selected character "' + userGuess + '" is not in the hidden word!')
    } else {
      console.log('The selected character "' + userGuess + '" *is* in the hidden word!')
    }

    let guessList = this.state.userGuessesString;

    guessList = guessList + userGuess + " ";

    this.setState({ userGuessesString: guessList })
  }

  switchOutUnderscores = (userGuess) => {
    let wordToGuess = this.state.wordtoguess;

    //This checks if the userGuess is found in the word to pick

    //If it isn't, you lose a life:
    if (wordToGuess.indexOf(userGuess) == -1) {
      console.log("Oh shoot, you've lost a life!")
      let livesLeft = this.state.lives;
      livesLeft = livesLeft - 1;

      this.setState({ lives: livesLeft });
      this.checkforLoss(livesLeft);

    }

    //If it is in the word, it will switch out the underscore with the userGuess.
    else {
      let indeces = [];
      for (var i = 0; i < wordToGuess.length; i++) {
        if (wordToGuess[i] === userGuess) {
          indeces.push(i)
        };
      }
      console.log("Indeces of letter picked: " + indeces)

      let tempdisplayedWord = this.state.displayedword

      for (var j = 0; j < indeces.length; j++) {
        tempdisplayedWord.splice(indeces[j], 1, userGuess)
      }

      console.log(tempdisplayedWord);
      this.setState({ displayedword: tempdisplayedWord });

      this.checkForWin(this.state.displayedword);


      // console.log(indeces);

    }
  }

  checkforLoss = (lives) => {
    if (lives === 0) {
      let losses = this.state.losses;

      this.setState({ losses: losses + 1 });
      this.resetGame();
    }
  }

  checkForWin = (currentDisplay) => {
    if (currentDisplay.indexOf("_") === -1) {
      console.log("You win!")
      this.setState({ wins: this.state.wins + 1 })

      this.resetGame()
    }
  }

  resetGame = () => {
    this.setState(
      {
        wordtoguess: "",
        displayedword: "",
        userGuesses: [],
        userGuessesString: "",
        lives: 5,
      }
    )
    this.loadWordToGuess()
  }

  //==============================================================
  //==============================================================
  // Component Mounting Functions
  //==============================================================


  // This creates the keystroke-logger function which lets the user select letters
  componentWillMount() {
    document.addEventListener(
      "keydown",
      this._handleKeyDown.bind(this)
    )
  }

  // Initial load of saved articles
  componentDidMount() { 
    this.loadBiodiversity();
    //this.loadWordToGuess();
  };

  // code to get biodiversity list
  loadBiodiversity = () => {
    API.getBiodiversity()
      .then(
      res => {
        //console.log("biodiversity list incoming: " + JSON.stringify(res.data, null, 2))
        let diverlist = res.data;
        let namelist = [];

        for (let n = 0; n< diverlist.length; n++){
          // && namelist.indexOf(diverlist[n]["Common Name"] >= 0)
          if (diverlist[n]["Category"] === "Animal"){
            namelist.push(diverlist[n]["Common Name"].toLowerCase());
          }
        }

        console.log(namelist.length);
        this.setState({ biodiversity: namelist });
        console.log("biodiversity list: " + JSON.stringify(this.state.biodiversity, null, 2));
        this.loadWordToGuess();
      })
      // console.log(res.data.response.docs);
      .catch(err => console.log(err));
  };


  // handle form input
  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  //loads a random entry from a selected category
  //for testing purposes now, using a static entry
  loadWordToGuess = () => {
    //let words = ["flamingo", "ocelot", "pistol shrimp", "cockatiel"]/*["pistol shrimp"]*/
    let words = this.state.biodiversity
    let word = words[Math.floor(Math.random() * words.length)]
    let wordArray = word.split("");
    console.log(wordArray);
    //declare an empty array for us to push our "_" symbols to
    let currentlyPicked = []

    // fill the currentlyPicked array with either underscores or spaces
    for (let i = 0; i < wordArray.length; i++) {
      switch (wordArray[i] !== " " || wordArray[i] !== "-" || wordArray[i] !== "'" ){
        case wordArray[i] === "'":
          currentlyPicked.push("'")
          break;

        case wordArray[i] === "-":
          currentlyPicked.push("-")
          break;

        case wordArray[i] === " ":
          currentlyPicked.push(" ")
          break;

        default:
        currentlyPicked.push("_")
      }


      // if (wordArray[i] !== " ") {
      //   currentlyPicked.push("_")
      // } else {
      //   currentlyPicked.push(" ")
      // }
    }

    console.log(currentlyPicked)
    //currentlyPicked = wordArray.fill("_");
    this.setState({ wordtoguess: word });
    this.setState({ displayedword: currentlyPicked });
  }


  // search NYT for articles
  handleFormSubmit = event => {
    // When the form is submitted, prevent its default behavior, get recipes update the recipes state
    event.preventDefault();
    if (this.state.searchterm) {
      APINYT.search(this.state.searchterm,
        this.state.numberofrecords,
        this.state.startyear,
        this.state.endyear
      )
        .then(res => {
          this.setState({ articles: res.data.response.docs });
        })
        .catch(err => console.log(err));
    }
  };

  //save an article
  handleArticleSave = (data) => {
    // When the form is submitted, prevent its default behavior, get recipes update the recipes state
    API.saveArticle(data)
      .then(res => this.loadSavedArticles())
      // console.log(res.data.response.docs);
      .catch(err => console.log(err));
  };

  // delete a saved article
  handleArticleDelete = (id) => {
    // When the form is submitted, prevent its default behavior, get recipes update the recipes state
    API.deleteArticle(id)
      .then(res => this.loadSavedArticles())
      // console.log(res.data.response.docs);
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>Hangman</h1>
            </Jumbotron>
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Stats </strong></h3>
              </div>
              <div className="panel-body">
                <Row>
                  <Col size="md-6">
                    {/* Hangman Pic Goes Here */}
                    <h2> Hangman Pic Goes here </h2>
                  </Col>
                  <Col size="md-6">
                    <Row>
                      <Col size="md-12">
                        {/* Current Guesses */}
                        <div className="panel panel-secondary">
                          <div className="panel-heading">
                            <h3 className="panel-title">
                              <strong><i className="fa fa-table"></i> List of Current Guesses </strong>
                            </h3>
                          </div>
                          <div className="panel-body">
                            {this.state.userGuesses.length ? (
                              <h4> {this.state.userGuessesString} </h4>
                            ) : (
                                <h3>Use Your Keyboard to Enter Guesses!</h3>
                              )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col size="md-12">
                        {/* Lives left */}
                        <h2> Lives left (this round): {this.state.lives} </h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col size="md-12">
                        <Row>
                          <Col size="md-6">
                            {/* Wins */}
                            <h2> Total Wins: {this.state.wins}</h2>
                          </Col>
                          <Col size="md-6">
                            {/* Losses */}
                            <h2> Total Losses: {this.state.losses} </h2>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>

          </Col>
        </Row >
        <Row>
          <Col size="md-12">
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Word to Guess</strong></h3>
              </div>
              <div className="panel-body" id="well-section">
                <List>
                  <ListItem>
                    <h3>{this.state.wordtoguess}</h3>
                  </ListItem>
                </List>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Word to Guess</strong></h3>
              </div>
              <div className="panel-body" id="well-section">
                <List>
                  <ListItem>
                    <h3>{this.state.displayedword}</h3>
                  </ListItem>
                </List>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col size="md-12">
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Top Articles</strong></h3>
              </div>
              <div className="panel-body" id="well-section">
                {this.state.articles.length ? (
                  <List>
                    {this.state.articles.slice(0, this.state.numberofrecords).map((article, index) => (
                      <ListItem key={article.pub_date}>
                        <h3>{article.headline.main}</h3>
                        <a href={article.web_url}>{article.web_url} </a>
                        <h3>{article.pub_date}</h3>
                        <button type="submit"
                          className="btn btn-default"
                          onClick={() => this.handleArticleSave({
                            title: article.headline.main,
                            url: article.web_url,
                            date: article.pub_date
                          })}
                          id="saveArticle"><i className="fa fa-search"></i> Save</button>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                    <h3>No Results to Display</h3>
                  )}
              </div>
            </div>
          </Col>
        </Row>
        {/* Saved Articles */}
        <Row>
          <Col size="md-12">

            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Saved Articles</strong></h3>
              </div>
              <div className="panel-body" id="well-section">
                {this.state.savedarticles.length ? (
                  <List>
                    {this.state.savedarticles.map((article, index) => (
                      <ListItem key={article._id}>
                        <h3>{article.title}</h3>
                        <a href={article.url}>{article.url} </a>
                        <h3>{article.date}</h3>
                        <button type="submit"
                          className="btn btn-default"
                          onClick={() => this.handleArticleDelete(article._id)}
                          id="deleteArticle"><i className="fa fa-search"></i> Delete</button>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                    <h3>No Results to Display</h3>
                  )}
              </div>
            </div>
          </Col>
        </Row>
      </Container >
    );
  }
}

export default Articles;
