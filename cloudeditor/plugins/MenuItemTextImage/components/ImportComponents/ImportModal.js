const React = require("react");
const ImportHeader = require("../ImportComponents/ImportHeader");
const ImportBody = require("../ImportComponents/ImportBody");
const { withNamespaces } = require("react-i18next");
const axios = require("axios");
const qs = require("qs");

const TEXT_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/personalize/editor/texts";

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
    loading: false
  };

  componentDidMount() {
    this.setState({
      selectedFavourite: this.props.isFavourite ? 1 : 0
    });

    this.readItems(0);
  }

  changePoptextValue = event => {
    if (event.target.name === "categories") {
      this.setState({ selectedCategory: event.target.value });
    } else if (event.target.name === "sort") {
      this.setState({ selectedSort: event.target.value });
    } else if (event.target.name === "favourite") {
      this.setState({ selectedFavourite: event.target.value });
    }

    this.readItems(0);
  };

  handlePageClick = data => {
    this.setState({ pageSelected: data.selected });
    this.readItems(data.selected);
  };

  textSelected = id => {
    this.setState({ textSelectedId: id });
  };

  readItems = pageSelected => {
    this.setState({ loading: true });
    const serverData = {
      per_page: this.state.perPage,
      page_no: pageSelected,
      order_by: "id",
      /*this.state.selectedSort === 0
          ? "date"
          : this.state.selectedSort === 1
          ? "name"
          : "id",
*/
      show_fav: this.state.selectedFavourite,
      content_group: this.state.selectedCategory
    };

    axios
      .post(this.props.isText ? TEXT_URL : IMAGE_URL, qs.stringify(serverData))
      .then(resp => resp.data)
      .then(data => {
        if (data.errors === false) {
          this.setState({
            page: data.data.data,
            pageCount: data.data.total / this.state.perPage,
            pageSelected: data.data.page_no
          });
        }
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(data, "error");
        this.setState({ loading: false, pageCount: 0 });
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
        />

        <ImportBody
          page={this.state.page}
          textSelectedId={this.state.textSelectedId}
          textSelected={this.textSelected}
          loading={this.state.loading}
          isText={this.props.isText}
          onAddBlock={this.props.onAddBlock}
          closeModal={this.props.closeModal}
        />
      </div>
    );
  }
}

module.exports = withNamespaces("menuItemTextImage")(ImportModal);
