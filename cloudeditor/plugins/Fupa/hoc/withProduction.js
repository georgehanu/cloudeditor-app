const React = require("react");
const InsertInProduction = require("../components/TeamSelection/InsertInProduction/InsertInProduction");
const ToggleTable = require("../components/TeamSelection/ToggleTable/ToggleTable");
const uuidv4 = require("uuid/v4");

const { connect } = require("react-redux");
const { getEmptyObject } = require("../../../core/utils/ProjectUtils");

const { addObject } = require("../../../core/stores/actions/project");
const { compose } = require("redux");

const emptyTable = getEmptyObject({
  type: "tinymce",
  width: 200,
  height: 200,
  left: 200,
  top: 200
});

const tableStyle = {
  //width: "calc(100% - 4px)",
  width: "100%",
  borderSpacing: "0",
  color: "black"
};

const withProductionHoc = (WrappedComponent, TableName) => props => {
  const WithProduction = class extends React.Component {
    state = {
      tabelId: uuidv4()
    };
    handleClick = () => {
      const tableContent = document.getElementById(this.state.tabelId)
        .innerHTML;

      const tableDimensions = document
        .getElementById(this.state.tabelId)
        .getBoundingClientRect();

      width = props.width ? props.width : tableDimensions.width;

      props.addObject({
        ...emptyTable,
        tableContent: tableContent,
        id: uuidv4(),
        //width: tableDimensions.width + 4,
        width,
        height: tableDimensions.height
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
                  <table style={{ ...tableStyle }}>
                    <tbody>
                      <WrappedComponent {...props} />
                    </tbody>
                  </table>
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
  return { addObject: payload => dispatch(addObject(payload)) };
};

const withProduction = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withProductionHoc
);

module.exports = withProduction;
