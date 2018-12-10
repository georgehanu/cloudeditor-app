const React = require("react");
const Backdrop = require("./Backdrop");
const AddPagesHeader = require("./AddPagesHeader");
const AddPagesBody = require("./AddPagesBody");
const AddPagesFooter = require("./AddPagesFooter");

const AFTER = "AFTER";
const BEFORE = "BEFORE";
const END = "END";

class AddPages extends React.Component {
  state = {
    checkboxes: [],
    checkboxesSelected: null
  };

  componentDidMount() {
    let newCheckboxes = [];
    newCheckboxes.push({
      label: "after page " + this.props.page,
      value: AFTER
    });
    newCheckboxes.push({
      label: "before page " + this.props.page,
      value: BEFORE
    });
    newCheckboxes.push({
      label: "to the end of the project",
      value: END
    });

    this.setState({ checkboxes: newCheckboxes, checkboxesSelected: AFTER });
  }

  onCheckboxChanged = checkboxesSelected => {
    this.setState({ checkboxesSelected });
    this.props.onCheckboxChanged(checkboxesSelected);
  };

  render() {
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.hideAddPages} />
        <div className="AddPagesModal">
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
