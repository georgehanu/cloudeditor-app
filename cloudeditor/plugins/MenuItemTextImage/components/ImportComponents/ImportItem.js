const React = require("react");
const { withNamespaces } = require("react-i18next");

const IMAGE_SRC_URL =
  "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/media//personalization/html5_files/grouped_images/";

const importItem = props => {
  if (props.isText)
    return (
      <li className="importTextItem">
        <input
          type="radio"
          className="importTextItemRadio"
          id={"label_" + props.id}
          defaultChecked={props.checked}
          onChange={() => props.textSelected(props.id)}
        />
        <label
          htmlFor={"label_" + props.id}
          className="itemLabel"
          dangerouslySetInnerHTML={{ __html: props.text }}
        />
        {props.checked && (
          <div className="importTextItemSet">
            <div className="importTextItemInProduction">
              <i />
              <span
                onClick={() => {
                  props.onAddBlock({ subType: "textflow", value: props.text });
                  props.closeModal();
                }}
              >
                {props.t("Insert in product")}
              </span>
            </div>
            <div className="importTextItemFavourite">
              <input type="checkbox" defaultChecked={props.status} />
              {props.t("Favourite")}
            </div>
          </div>
        )}
      </li>
    );
  else
    return (
      <li className="importImageItem">
        <label className="itemLabel">{props.filename}</label>
        <span className="itemLabelDate">{props.date_added}</span>
        <div
          className="itemImage"
          onClick={() => {
            props.onAddBlock({
              type: "graphics",
              image_src: IMAGE_SRC_URL + props.image,
              imagePath: props.image
            });
            props.closeModal();
          }}
        >
          <img src={IMAGE_SRC_URL + props.image} alt="" />
        </div>
        <div className="importImageItemSet">
          <div className="importImageItemFavourite">
            <input type="checkbox" defaultChecked={props.status} />
            {props.t("Favourite")}
          </div>
          <div className="importImageItemInProduction">
            <i />
            <span
              onClick={() => {
                props.onAddBlock({
                  type: "graphics",
                  image_src: IMAGE_SRC_URL + props.image,
                  imagePath: props.image
                });
                props.closeModal();
              }}
            >
              {props.t("Insert in product")}
            </span>
          </div>
        </div>
      </li>
    );
};

module.exports = withNamespaces("menuItemTextImage")(importItem);
