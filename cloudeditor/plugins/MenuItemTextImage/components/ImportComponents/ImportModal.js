const React = require("react");
const ImportHeader = require("../ImportComponents/ImportHeader");
const ImportBody = require("../ImportComponents/ImportBody");
const { withNamespaces } = require("react-i18next");
const axios = require("axios");
const qs = require("qs");

const TEXT_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/editor/texts";

const SET_COOKIE_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/editor/setcontentcookie";

const IMAGE_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/editor/images";

class ImportModal extends React.Component {
  state = {
    selectedCategory: 0,
    selectedSort: 0,
    selectedFavourite: 0,
    perPage: 20,
    page: [],
    pageCount: 0,
    pageSelected: 0,
    textSelectedId: null,
    loading: false,
    textCookies: [],
    iamgeCookies: [],
    errorMessage: null
  };

  componentDidMount() {
    this.setState({
      selectedFavourite: this.props.isFavourite ? 1 : 0
    });

    this.readItems(0, 0, 0, 0);
  }

  changePoptextValue = event => {
    let category = this.state.selectedCategory;
    let sort = this.state.selectedSort;
    let fav = this.state.selectedFavourite;

    if (event.target.name === "categories") {
      category = parseInt(event.target.value);
      this.setState({ selectedCategory: category });
    } else if (event.target.name === "sort") {
      sort = parseInt(event.target.value);
      this.setState({ selectedSort: sort });
    } else if (event.target.name === "favourite") {
      fav = event.target.value;
      this.setState({ selectedFavourite: fav });
    }

    this.readItems(0, category, sort, fav);
  };

  handlePageClick = data => {
    this.setState({ pageSelected: data.selected });
    this.readItems(
      data.selected,
      this.state.selectedCategory,
      this.state.selectedSort,
      this.state.selectedFavourite
    );
  };

  textSelected = id => {
    this.setState({ textSelectedId: id });
  };

  readItems = (pageSelected, category, sort, fav) => {
    let order_by = null;
    if (this.props.isText) {
      order_by = sort === 0 ? "date_added" : sort === 1 ? "text" : "id";
    } else {
      order_by = sort === 0 ? "date_added" : "filename";
    }
    this.setState({ loading: true });
    const serverData = {
      per_page: this.state.perPage,
      page_no: pageSelected + 1,
      order_by: order_by,
      show_fav: fav,
      content_group: category
    };

    axios
      .post(this.props.isText ? TEXT_URL : IMAGE_URL, qs.stringify(serverData))
      .then(resp => resp.data)
      .then(data => {
        if (data.errors === false) {
          this.setState({
            page: data.data.data,
            pageCount: data.data.total / this.state.perPage,
            pageSelected: parseInt(data.data.page_no) - 1,
            errorMessage: null
          });
        } else {
          this.setState({ errorMessage: data.message, pageCount: 0 });
        }
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ loading: false, pageCount: 0 });
      });
  };

  markFavouriteHandler = event => {
    this.setState({ loading: true });
    const serverData = {
      type: this.props.isText ? "text" : "user_image",
      value: event.target.name,
      delete: "0"
    };

    axios
      .post(SET_COOKIE_URL, qs.stringify(serverData))
      .then(resp => resp.data)
      .then(data => {
        if (data.errors === false) {
        }
        this.setState({ loading: false });
      })
      .catch(error => {
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
          pageCount={this.state.pageCount}
          handlePageClick={this.handlePageClick}
          closeModal={this.props.closeModal}
          pageSelected={this.state.pageSelected}
        />

        {this.state.errorMessage === null || this.state.loading ? (
          <ImportBody
            page={this.state.page}
            textSelectedId={this.state.textSelectedId}
            textSelected={this.textSelected}
            loading={this.state.loading}
            isText={this.props.isText}
            onAddBlock={this.props.onAddBlock}
            closeModal={this.props.closeModal}
            markFavourite={this.markFavouriteHandler}
          />
        ) : (
          <div className="importModalErrorMessage">
            {this.state.errorMessage}
          </div>
        )}
      </div>
    );
  }
}

module.exports = withNamespaces("menuItemTextImage")(ImportModal);
