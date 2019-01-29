const { clone, mergeDeepRight } = require("ramda");

createElement = (type, style, attrs, childs) => {
  return {
    type,
    style,
    attrs,
    childs
  };
};

const Colors = {
  ownTeam: {
    /*backgroundColor: "black",
      color: "White"*/
  },
  oddRow: {
    backgroundColor: "white"
  },
  evenRow: {
    backgroundColor: "#f3f3f3"
  },
  up1: {
    backgroundColor: "#002e5f",
    color: "white"
  },
  up2: {
    backgroundColor: "#145485",
    color: "white"
  },
  up3: {
    backgroundColor: "#5987b8",
    color: "white"
  },
  down1: {
    backgroundColor: "#145485",
    color: "white"
  },
  down2: {
    backgroundColor: "#002e5f",
    color: "white"
  }
};

const getTableProps = (internalProps, size, cfg) => {
  if (size === undefined) size = "big";

  const props = mergeDeepRight(internalProps.default, internalProps[size]);

  return mergeDeepRight(props, cfg || {});
};

const Matches = {
  matchesWeekDay: [
    "Match_Monday",
    "Match_Tuesday",
    "Match_Wednesday",
    "Match_Thursday",
    "Match_Friday",
    "Match_Saturday",
    "Match_Sunday"
  ],

  props: {
    default: {
      fontFamily: "Arial",
      td: {
        default: {
          margin: "0",
          borderBottom: "1px solid #fff",
          textAlign: "center",
          border: "none",
          backgroundColor: "inherit"
        },
        matchDayNumber: {
          fontWeight: "bold"
        },
        matchDate: {},
        location: {
          fontWeight: "bold"
        },
        oponentName: {}
      },
      teamLogo: {
        objectFit: "contain"
      },
      scoreDivContainer: {
        color: "#212121",
        position: "relative",
        textAlign: "center",
        fontWeight: "normal !important",
        backgroundColor: "#3bba27",
        float: "right"
      }
    },
    small: {
      fontSize: "6px",
      tr: {}
    },
    medium: {
      fontSize: "8px",
      tr: {}
    },
    normal: {
      fontSize: "10px",
      tr: {}
    },
    big: {
      fontSize: "12px",
      tr: {},
      td: {
        default: {
          padding: "5px",
          paddingRight: "2px",
          margin: "0"
        },
        matchDayNumber: {
          width: "20px",
          paddingLeft: "2px"
        },
        image: {
          width: "30px",
          padding: "1px 2px"
        },
        score: {
          paddingRight: "0px"
        }
      },
      teamLogo: {
        height: "25px",
        width: "25px",
        marginLeft: "3px"
      },
      scoreDivContainer: {
        fontSize: "14px",
        width: "60px",
        height: "24px"
      },
      scoreInfoDiv: {
        lineHeight: "24px"
      }
    }
  },

  makeData(teamId, matches, size, cfg, translateFn) {
    if (typeof translateFn !== "function") translateFn = _ => _;

    const props = getTableProps(Matches.props, size, cfg);

    const { fontSize, fontFamily } = props;

    let index = 0;
    matches.forEach(function(el) {
      const matchDayNumberTd = Matches.makeMatchDayNumberTd(
        el,
        mergeDeepRight(props.td.default, props.td.matchDayNumber),
        translateFn
      );
      const matchDateTd = Matches.makeMatchDateTd(
        el,
        mergeDeepRight(props.td.default, props.td.matchDate),
        translateFn
      );

      const locationTd = Matches.makeLocationTd(
        el,
        teamId,
        mergeDeepRight(props.td.default, props.td.location),
        translateFn
      );
      const imageTd = Matches.makeImageTd(
        el,
        teamId,
        mergeDeepRight(props.td.default, props.td.image),
        props.teamLogo,
        translateFn
      );

      const oponentNameTd = Matches.makeOponentNameTd(
        el,
        teamId,
        mergeDeepRight(props.td.default, props.td.oponentName),
        translateFn
      );

      const scoreTd = Matches.makeScoreTd(
        el,
        teamId,
        mergeDeepRight(props.td.default, props.td.score),
        props.scoreDivContainer,
        props.teamLogo,
        translateFn
      );

      const emptyTd = createElement(
        "td",
        {
          ...props.td.default
        },
        {},
        "&nbsp;"
      );

      let tr = createElement("tr", { backgroundColor: tdBackground }, "", [
        matchDayNumberTd,
        matchDateTd,
        locationTd,
        imageTd,
        oponentNameTd,
        emptyTd,
        scoreTd
      ]);
      index++;
    });
  },

  makeMatchDayNumberTd(el, props, translateFn) {
    const matchDayNumber =
      el.matchDayNumber === 0 ? translateFn("NA") : el.matchDayNumber + ".";

    const td = createElement(
      "td",
      {
        ...props
      },
      {},
      matchDayNumber
    );
    return td;
  },
  makeMatchDateTd(el, props, translateFn) {
    const kickoffDate = new Date(el.kickoff);
    const kickoffDay =
      kickoffDate.getDate() > 9
        ? kickoffDate.getDate()
        : "0" + kickoffDate.getDate();
    const kickoffMonth =
      kickoffDate.getMonth() > 8
        ? kickoffDate.getMonth() + 1
        : "0" + (kickoffDate.getMonth() + 1);
    const kickoffDateStr = kickoffDay + "." + kickoffMonth;
    const weekDate = translateFn(Matches.matchesWeekDay[kickoffDate.getDay()]);
    const td = createElement(
      "td",
      {
        ...props
      },
      {},
      weekDate + ", " + kickoffDateStr
    );
    return td;
  },
  makeLocationTd(el, teamId, props, translateFn) {
    let location = null;
    if (el.guestTeam.id === teamId) {
      location = props.t("AwayLetter");
    } else {
      location = props.t("HomeLetter");
    }
    const td = createElement(
      "td",
      {
        ...props
      },
      {},
      location
    );
    return td;
  },
  makeImageTd(el, teamId, props, teamLogoProps, translateFn) {
    let oponentTeam = el.guestTeam.id === teamId ? el.homeTeam : el.guestTeam;

    const imageUrl =
      oponentTeam.image.basePath +
      (oponentTeam.image.svg
        ? "svg/" + oponentTeam.image.baseName
        : "png/25x25/" + oponentTeam.image.baseName);

    const src = "";
    const img = createElement(
      "img",
      { ...teamLogoProps },
      {
        src: imageUrl,
        title: oponentTeam.name.full,
        alt: oponentTeam.name.full
      },
      null
    );
    const td = createElement(
      "td",
      {
        ...props
      },
      {},
      [img]
    );
    return td;
  },
  makeOponentNameTd(el, teamId, props, translateFn) {
    let oponentTeam = el.guestTeam.id === teamId ? el.homeTeam : el.guestTeam;

    const td = createElement(
      "td",
      {
        ...props
      },
      { align: "left" },
      oponentTeam.name.full
    );
    return td;
  },
  makeScoreTd(
    el,
    teamId,
    props,
    scoreDivContainerProps,
    teamLogoProps,
    translateFn
  ) {
    let currentTeamGoals = 0;
    let opositeTeamGoals = 0;

    if (el.guestTeam.id === props.teamId) {
      currentTeamGoals = el.guestGoal;
      opositeTeamGoals = el.homeGoal;
    } else {
      currentTeamGoals = el.homeGoal;
      opositeTeamGoals = el.guestGoal;
    }

    let matchInfo = null;
    let matchInfoBgColor = null;
    let matchInfoFgColor = "white";

    if (el.section === "PRE") {
      // match did not happen yet, we have to display the date
      matchInfoBgColor = "#ececec";
      matchInfo = (
        <div style={{ lineHeight: "24px" }}>
          <span style={{ color: "#000", fontSize: "11px" }}>
            {kickoffDateStr}
          </span>
        </div>
      );
    } else {
      // display the score
      if (currentTeamGoals === opositeTeamGoals) {
        matchInfoBgColor = "#a0a0a0";
      } else if (currentTeamGoals > opositeTeamGoals) {
        matchInfoBgColor = "#3bba27";
      } else {
        matchInfoBgColor = "#e50a19";
      }
      matchInfo = (
        <div style={{ lineHeight: "24px" }}>
          <span>{el.homeGoal}</span>
          <span>:</span>
          <span>{el.guestGoal}</span>
        </div>
      );
    }

    const scoreDivContainer = createElement("div", {
      ...scoreDivContainerProps,
      backgroundColor: matchInfoBgColor
    });

    const td = createElement(
      "td",
      {
        ...props
      },
      {}
    );
    return td;
  }
};

const FupaUtils = {
  getTableProps,
  Colors,
  Matches
};

module.exports = FupaUtils;
