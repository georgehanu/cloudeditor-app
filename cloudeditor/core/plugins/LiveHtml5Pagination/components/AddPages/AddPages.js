const React = require("react");
const Backdrop = require("../../../../../core/components/Backdrop/Backdrop");

require("./AddPages.css");
const AddPagesHeader = require("./AddPagesHeader");
const AddPagesBody = require("./AddPagesBody");
const AddPagesFooter = require("./AddPagesFooter");

const AFTER = "after";
const BEFORE = "before";
const END = "end";

class AddPages extends React.Component {
  state = {
    checkboxes: [],
    checkboxesSelected: null
  };

  componentDidMount() {
    let newCheckboxes = [];
    newCheckboxes.push({
      label: "after page %page_label%",
      value: AFTER
    });
    newCheckboxes.push({
      label: "before page %page_label%",
      value: BEFORE
    });
    newCheckboxes.push({
      label: "to the end of the project",
      value: END
    });

    this.setState({ checkboxes: newCheckboxes, checkboxesSelected: AFTER });
  }

  onCheckboxChanged = checkboxesSelected => {
    console.log(checkboxesSelected, "SELE");
    this.setState({ checkboxesSelected });
    this.props.onCheckboxChanged(checkboxesSelected);
  };

  render() {
    return (
      <React.Fragment>
        <Backdrop
          show={this.props.show}
          clicked={this.props.hideAddPages}
          classBackdrop="pageSelectorBackdrop"
        />
        <div className="addPagesModal">
          <AddPagesHeader modalClosed={this.props.hideAddPages} />
          <AddPagesBody
            checkboxes={this.state.checkboxes}
            checkboxesSelected={this.state.checkboxesSelected}
            onCheckboxChanged={this.onCheckboxChanged}
            changePagesToInsert={this.props.changePagesToInsert}
            nrPagesToInsert={this.props.nrPagesToInsert}
          />
          <AddPagesFooter addPages={this.props.addPages} />
        </div>
      </React.Fragment>
    );
  }
}

module.exports = AddPages;
