const React = require("react");
const Backdrop = require("../../../../core/components/Backdrop/Backdrop");
const ImportModal = require("./ImportModal");
require("./ImportType.css");
const { withNamespaces } = require("react-i18next");

const orFavourite = { 0: "All", 1: "Favourite" };
const orSortText = { 0: "Date", 1: "Name", 2: "Normal" };
const orSortImage = { 0: "Date", 1: "Name" };

const importType = props => {
  let favourite = orFavourite;
  let sort = {};
  if (props.isText) {
    sort = orSortText;
  } else {
    sort = orSortImage;
  }

  return (
    <React.Fragment>
      <Backdrop
        classBackdrop="importBackdrop"
        show={true}
        clicked={props.closeModal}
      />
      <ImportModal
        isFavourite={props.isFavourite}
        isText={props.isText}
        categories={props.categories}
        sort={sort}
        favourite={favourite}
        closeModal={props.closeModal}
        onAddBlock={props.onAddBlock}
      />
    </React.Fragment>
  );
};

module.exports = withNamespaces("menuItemTextImage")(importType);
