const React = require("react");
const ImportHeader = require("../ImportComponents/ImportHeader");
const ImportBody = require("../ImportComponents/ImportBody");
const { withNamespaces } = require("react-i18next");
const axios = require("axios");

const TEXT_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/editor/texts";

const IMAGE_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/editor/images";

class ImportModal extends React.Component {
  state = {
    selectedCategory: 0,
    selectedSort: 0,
    selectedFavourite: 0,
    perPage: 10,
    page: [],
    pageSelected: 0,
    textSelectedId: null,
    loading: false
  };

  componentDidMount() {
    this.setState({
      selectedFavourite: this.props.isFavourite ? 1 : 0
    });

    this.readItems();
  }

  changePoptextValue = event => {
    if (event.target.name === "categories") {
      this.setState({ selectedCategory: event.target.value });
    } else if (event.target.name === "sort") {
      this.setState({ selectedSort: event.target.value });
    } else if (event.target.name === "favourite") {
      this.setState({ selectedFavourite: event.target.value });
    }

    this.readItems();
  };

  handlePageClick = data => {
    this.setState({ pageSelected: data.selected });
  };

  textSelected = id => {
    this.setState({ textSelectedId: id });
  };

  readItems = () => {
    this.setState({ loading: true });
    const serverData = {
      per_page: this.state.perPage,
      order_by:
        this.state.selectedSort === 0
          ? "date"
          : this.state.selectedSort === 1
          ? "name"
          : "id",
      show_fav: this.state.selectedFavourite === 1,
      content_group: this.state.selectedCategory
    };

    axios
      .post(this.props.isText ? TEXT_URL : IMAGE_URL, serverData)
      .then(resp => resp.data)
      .then(data => {
        if (data.errors === false) {
          this.setState({ page: data.data.data });
        }
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(data, "error");
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div
        className={this.props.isText ? "importTextModal" : "importImageModal"}
      >
        <ImportHeader
          categories={this.props.categories}
          selectedCategory={this.state.selectedCategory}
          sort={this.props.sort}
          selectedSort={this.state.selectedSort}
          favourite={this.props.favourite}
          selectedFavourite={this.state.selectedFavourite}
          changePoptextValue={this.changePoptextValue}
          pageCount={1 /*this.state.pages.length*/}
          handlePageClick={this.handlePageClick}
        />

        <ImportBody
          page={this.state.page}
          textSelectedId={this.state.textSelectedId}
          textSelected={this.textSelected}
          loading={this.state.loading}
          isText={this.props.isText}
        />
      </div>
    );
  }
}

module.exports = withNamespaces("menuItemTextImage")(ImportModal);
