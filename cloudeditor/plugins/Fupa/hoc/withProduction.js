const React = require("react");
const InsertInProduction = require("../components/TeamSelection/InsertInProduction/InsertInProduction");
const ToggleTable = require("../components/TeamSelection/ToggleTable/ToggleTable");
const uuidv4 = require("uuid/v4");

const { connect } = require("react-redux");
const { getEmptyObject } = require("../../../core/utils/ProjectUtils");

const { addTable } = require("../../../core/stores/actions/project");
const { compose } = require("redux");

const emptyTable = getEmptyObject({
  type: "tinymceTable",
  subType: "tinymceTable",
  width: null,
  height: null,
  left: 17,
  top: 17
});

const withProductionHoc = (WrappedComponent, TableName) => props => {
  const WithProduction = class extends React.Component {
    state = {
      tabelId: uuidv4()
    };
    handleClick = () => {
      let tableContent = document
        .getElementById(this.state.tabelId)
        .innerHTML.replace(new RegExp("pt", "g"), "px");

      const tableDimensions = document
        .getElementById(this.state.tabelId)
        .getBoundingClientRect();

      width = props.width ? props.width : tableDimensions.width;

      props.addTable({
        ...emptyTable,
        tableContent: tableContent,
        id: uuidv4(),
        width: null,
        height: null,
        tableWidth: null,
        tableHeight: null
      });
    };
    render() {
      return (
        <div className="Container">
          <InsertInProduction handleClick={this.handleClick} />
          <div className={TableName}>
            <div>
              <ToggleTable TableName={TableName}>
                <div id={this.state.tabelId} className="ContainerTable">
                  <WrappedComponent {...props} />
                </div>
              </ToggleTable>
            </div>
          </div>
        </div>
      );
    }
  };

  return <WithProduction />;
};

const mapStateToProps = state => {
  return {
    activePage: state.project.activePage
  };
};

const mapDispatchToProps = dispatch => {
  return { addTable: payload => dispatch(addTable(payload)) };
};

const withProduction = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withProductionHoc
);

module.exports = withProduction;
