const React = require("react");
const Backdrop = require("./Backdrop");
const ImportModal = require("./ImportModal");
require("./ImportType.css");
const { withNamespaces } = require("react-i18next");

const orCategories = [
  "All",
  "Christmas",
  "Birthday",
  "Invitation",
  "Wedding",
  "Thanksgiving"
];

const orFavourite = ["All", "Favourite"];

const orSortText = ["Date", "Name", "Normal"];
const orSortImage = ["Date", "Name"];

const importType = props => {
  let categories = [];
  let favourite = [];
  let sort = [];
  if (props.isText) {
    for (let s in orSortText) {
      sort.push(props.t(orSortText[s]));
    }
  } else {
    for (let s in orSortImage) {
      sort.push(props.t(orSortImage[s]));
    }
  }

  for (let cat in orCategories) {
    categories.push(props.t(orCategories[cat]));
  }
  for (let fav in orFavourite) {
    favourite.push(props.t(orFavourite[fav]));
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
        categories={categories}
        sort={sort}
        favourite={favourite}
      />
    </React.Fragment>
  );
};

module.exports = withNamespaces("menuItemTextImage")(importType);
