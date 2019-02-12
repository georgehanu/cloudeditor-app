const React = require("react");
const InsertInProduction = require("../components/TeamSelection/InsertInProduction/InsertInProduction");
const ToggleTable = require("../components/TeamSelection/ToggleTable/ToggleTable");
const uuidv4 = require("uuid/v4");

const { connect } = require("react-redux");
const { getEmptyObject } = require("../../../core/utils/ProjectUtils");

const { addTable } = require("../../../core/stores/actions/project");
const { compose } = require("redux");
const {
  teamMatchesQuerySelector,
  teamStandingsQuerySelector,
  teamPlayersQuerySelector,
  teamMatchesSelector,
  teamStandingsSelector,
  teamPlayersSelector
} = require("..//store/selectors");
const { renderToString } = require("react-dom/server");
const ShowTable = require("../components/TeamSelection/ShowTable/ShowTable");

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

      let queryData = {};
      let tableData = {};
      if (TableName === "Standings") {
        queryData = props.teamStandingsQuery;
        tableData = props.teamStandings;
      } else if (TableName === "Matches") {
        queryData = props.teamMatchesQuery;
        tableData = props.teamMatches;
      } else if (TableName === "Players") {
        queryData = props.teamPlayersQuery;
        tableData = props.teamPlayers;
      }

      const fupaData = {
        type: TableName,
        queryData
      };

      const formattedTable = renderToString(
        <ShowTable
          tableData={tableData}
          tableName={fupaData.type}
          fupaData={fupaData}
          tableStyle="small"
          t={props.t}
        />
      );

      props.addTable({
        ...emptyTable,
        tableContent: formattedTable,
        id: uuidv4(),
        width: null,
        height: null,
        tableWidth: null,
        tableHeight: null,
        fupaData
      });
    };

    render() {
      return (
        <div className="Container">
          <InsertInProduction handleClick={this.handleClick} t={props.t} />
          <div className={TableName}>
            <div>
              <ToggleTable TableName={TableName} t={props.t}>
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
    teamMatchesQuery: teamMatchesQuerySelector(state),
    teamStandingsQuery: teamStandingsQuerySelector(state),
    teamPlayersQuery: teamPlayersQuerySelector(state),
    teamMatches: teamMatchesSelector(state),
    teamPlayers: teamPlayersSelector(state),
    teamStandings: teamStandingsSelector(state)
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
