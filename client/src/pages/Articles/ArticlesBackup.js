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
    searchterm : "",
    numberofrecords : 5,
    startyear : "",
    endyear : "",
    articles: [],
    savedarticles: []
  };

  // Initial load of saved articles
  componentDidMount() {
    this.loadSavedArticles("");
  }

  // code to get saved articles
  loadSavedArticles = () => {
    API.getArticles()
      .then(
        res => {
          this.setState({ savedarticles: res.data })
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
        .then(res => { this.setState({ articles: res.data.response.docs });
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
              <h1>New York Times Search</h1>
            </Jumbotron>
            <div className="panel panel-primary">
              <div className="panel-heading changeme">
                <h3 className="panel-title"><strong><i className="fa  fa-list-alt"></i>  Search Parameters</strong></h3>
              </div>
              <div className="panel-body">
                <form>
                  <label htmlFor="searchterm">Search Term:</label>
                  <Input name="searchterm"
                         value={this.state.searchterm}
                         onChange={this.handleInputChange}
                         placeholder="Search Term" />
                  <label htmlFor="numberofrecords">Number of Records:</label>
                  <select name="numberofrecords" 
                          value={this.state.numberofrecords}
                          onChange={this.handleInputChange}
                          className="form-control" 
                          id="num-records-select">
                    <option value="1">1</option>
						      	<option value="5" >5</option>
                    <option value="10">10</option>
                  </select>
                  <label htmlFor="startyear">Start Year (optional - must be 4 digit year):</label>
                  <Input name="startyear"
                         value={this.state.startyear}
                         onChange={this.handleInputChange} 
                         placeholder="Start Year" />
                  <label htmlFor="endyear">End Year (optional - must be 4 digit year):</label>
                  <Input name="endyear" 
                         value={this.state.endyear}
                         onChange={this.handleInputChange}
                         placeholder="End Year" />
                  <button type="submit" 
                          className="btn btn-default" 
                          onClick={this.handleFormSubmit}
                          id="run-search"><i className="fa fa-search"></i> Search</button>
                  {"     "}
                  <button type="button" className="btn btn-default" id="clear-all"><i className="fa fa-trash"></i> Clear Results</button>
                </form>
             </div>
            </div>
          </Col>
        </Row>
        {/* Results */}
        <Row>
            <Col size="md-12">
             <br />
             <div className="panel panel-primary">
               <div className="panel-heading">
                  <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Top Articles</strong></h3>
              </div>
              <div className="panel-body" id="well-section">
                {this.state.articles.length ? (
                  <List>
                    {this.state.articles.slice(0, this.state.numberofrecords).map((article,index) => (
                      <ListItem key={article.pub_date}>
                        <h3>{article.headline.main}</h3>
                        <a href={article.web_url}>{article.web_url} </a>
                        <h3>{article.pub_date}</h3>
                        <button type="submit"
                          className="btn btn-default"
                          onClick={() => this.handleArticleSave({title: article.headline.main, 
                                                                url: article.web_url,
                                                                date: article.pub_date})}
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
            <br />
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title"><strong><i className="fa fa-table"></i>  Saved Articles</strong></h3>
              </div>
              <div className="panel-body" id="well-section">
                {this.state.savedarticles.length ? (
                  <List>
                    {this.state.savedarticles.map((article, index) =>  (
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
      </Container>
    );
  }
}

export default Articles;
