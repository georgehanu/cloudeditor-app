const Standings = {
  default: {
    fupaTdBase: {
      padding: "4px 0px",
      margin: "0",
      borderBottom: "none",
      textAlign: "center",
      border: "none",
      fontFamily: "Arial"
    },
    fupaImageWrapperPicture: {
      objectFit: "contain",
      height: "inherit",
      width: "inherit",
      width: "25px",
      height: "25px"
    },
    tableStyle: {
      borderSpacing: "0",
      color: "black"
    },
    tbodyStyle: {
      fontFamily: "Arial",
      fontSize: "12px"
    },
    cols: {
      1: {
        width: "24px",
        fontWeight: "bold"
      },
      2: {
        width: "30px",
        padding: "1px 2px"
      },
      3: {
        width: "162px",
        textAlign: "left",
        paddingLeft: "4px"
      },
      4: { width: "18px" },
      5: { width: "18px" },
      6: { width: "18px" },
      7: { width: "18px" },
      8: { width: "40px" },
      9: { width: "18px" },
      10: { width: "20px" }
    }
  },
  small: {
    fupaTdBase: {
      padding: "0px"
    },
    tbodyStyle: {
      fontSize: "9px",
      lineHeight: "13px"
    },
    fupaImageWrapperPicture: {
      width: "10px",
      height: "10px"
    },
    cols: {
      2: {
        padding: "0px 2px"
      }
    }
  }
};
const Players = {
  default: {
    fupaTdBase: {
      padding: "4px 0px",
      margin: "0",
      borderBottom: "none",
      textAlign: "center",
      fontSize: "12px",
      lineHeight: "12px",
      border: "none",
      fontFamily: "Arial"
    },
    tableStyle: {
      borderSpacing: "0",
      color: "black"
    },
    tbodyStyle: {
      fontFamily: "Arial",
      fontSize: "12px"
    },
    cols: {
      1: {
        fontWeight: "bold",
        width: "24px"
      },
      2: { textAlign: "left" },
      3: { fontWeight: "bold" }
    }
  },
  small: {
    fupaTdBase: { padding: "0px" },
    tbodyStyle: { fontSize: "9px", lineHeight: "13px" }
  }
};
const Matches = {
  default: {
    fupaTdBase: {
      padding: "5px",
      paddingRight: "2px",
      margin: "0",
      borderBottom: "1px solid #fff",
      textAlign: "center",
      border: "none"
    },
    fupaImageWrapperPicture: {
      objectFit: "contain",
      height: "25px",
      width: "25px",
      marginLeft: "3px"
    },
    scoreCard: {
      color: "#212121",
      fontSize: "14px",
      position: "relative",
      textAlign: "center",
      width: "60px",
      fontWeight: "normal !important",
      backgroundColor: "#3bba27",
      height: "24px"
    },

    tableStyle: {
      borderSpacing: "0",
      color: "black"
    },
    tbodyStyle: {
      fontFamily: "Arial",
      fontSize: "12px",
      lineHeight: "24px"
    },
    cols: {
      1: {
        paddingLeft: "2px",
        fontWeight: "bold",
        width: "20"
      },
      2: {},
      3: { fontWeight: "bold" },
      4: { padding: "1px 2px", width: "30px" },
      5: { textAlign: "left" },
      6: {},
      7: { paddingRight: "0px" }
    }
  },
  small: {
    fupaTdBase: { padding: "0px" },
    tbodyStyle: { fontSize: "9px", lineHeight: "13px" },
    fupaImageWrapperPicture: {
      width: "10px",
      height: "10px"
    },
    scoreCard: {
      fontSize: "9px",
      height: "14px"
    },
    cols: {
      4: {
        padding: "0px 2px"
      }
    }
  }
};
const TableStyles = {
  Standings,
  Players,
  Matches
};

module.exports = TableStyles;
