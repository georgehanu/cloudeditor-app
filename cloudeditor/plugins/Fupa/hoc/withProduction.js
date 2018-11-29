const React = require("react");
const InsertInProduction = require("../components/TeamSelection/InsertInProduction/InsertInProduction");
const ToggleTable = require("../components/TeamSelection/ToggleTable/ToggleTable");

const withProduction = (WrappedComponent, TableName) => props => {
  return (
    <div className="Container">
      <InsertInProduction />
      <div className={TableName}>
        <div
          style={{
            fontSize: "12px",
            color: "#121212",
            backgroundColor: "#ececec",
            margin: "10px"
          }}
        >
          <table
            style={{ marginBottom: "9px", width: "100%", borderSpacing: "0" }}
          >
            <tbody>
              <ToggleTable TableName={TableName}>
                <WrappedComponent {...props} />
              </ToggleTable>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

module.exports = withProduction;
