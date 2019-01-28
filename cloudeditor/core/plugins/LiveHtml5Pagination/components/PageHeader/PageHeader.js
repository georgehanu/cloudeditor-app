const React = require("react");
const { withNamespaces } = require("react-i18next");

const PageHeader = props => {
  return (
    <div className="pageSelectorHeader">
      <div className="pageHeaderText">
        <div
          className="pageHeaderTextTitleContainer"
          onClick={props.showAddPages}
        >
          <span className="icon fupa-add-pages" />
          <span className="pageHeaderTextTitle">{props.t("Add pages")}</span>
        </div>
        <div className="pageHeaderTextInfoContainer">
          <span className="icon fupa-info" />
          <span className="pageHeaderTextTitle">
            {props.t("You can drag and drop pages along with their content")}
          </span>
        </div>
      </div>
      <div className="pageHeaderButtonsContainer">
        {props.showExtend && (
          <button
            className="pageHeaderButtonExtend"
            onClick={() => props.toggle("up")}
          >
            <span className="icon porto-up" />
          </button>
        )}
        {props.showMinimized && (
          <button
            className="pageHeaderButtonMinimize"
            onClick={() => props.toggle("down")}
          >
            <span className="icon porto-down" />
          </button>
        )}
      </div>
      {/*}
      <div className="pageAddPagesContainer">
        <button
          className="pageHeaderButtonAddPages"
          onClick={props.showAddPages}
        >
          {props.t("Add pages")}
        </button>        
      </div>
        */}
    </div>
  );
};

module.exports = withNamespaces("LiveHtml5Pagination")(PageHeader);
