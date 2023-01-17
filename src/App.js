import "./App.css";
import DropDownItem from "./components/DropDownItem";
import React, { useEffect, useRef, useState } from "react";
import Column from "./components/Column";
import { nanoid } from "nanoid";
import Archive from "./components/Archived";
import { DragDropContext } from "react-beautiful-dnd";
import { propTypes } from "react-bootstrap/esm/Image";
import Archived from "./components/Archived";
import { BiArrowBack } from "react-icons/bi";
import { VscEllipsis } from "react-icons/vsc";
import { VscIssueDraft } from "react-icons/vsc";
import { HiOutlineArchive } from "react-icons/hi";
import { isAccordionItemSelected } from "react-bootstrap/esm/AccordionContext";
import ArchiveAll from "./components/ArchiveAll";
import { Octokit } from "@octokit/rest";




function App() {
  const [dropDown, setDropDown] = useState(false);
  const [showss, setShowss] = useState(false);
  const [archivedState, setArchivedState] = useState(true);
  const [fetchdata, setFetchData] = useState(false);

  const handleShowss = () => {
    setShowss(true);
    const handleAllShow = columns.map((column) => {
      return {
        ...column,
        show: false,
        pick: false,
        highlight: false,
        called: false,
      };
    });
    setColumns(handleAllShow);
  };

  const hideShowss = () => setShowss(false);

  const onClick1 = () => {
    setDropDown(true);
    const handleAllShow = columns.map((column) => {
      return {
        ...column,
        show: false,
        pick: false,
        highlight: false,
        called: false,
      };
    });
    setColumns(handleAllShow);
  };

  const onClick2 = () => {
    setDropDown(false);
  };

  const [columns, setColumns] = useState([]);
  const [count, setCount] = useState(0);

  //to get length of total archive items
  const getTotalLength = (array, innerArrayProperty, innerProperty) => {
    let totalLength = 0;
    for (const object of array) {
      for (const innerObject of object[innerArrayProperty]) {
        if (innerObject[innerProperty]) {
          totalLength++;
        }
      }
    }
    return totalLength;
  };

  const totalLength = getTotalLength(columns, "issue", "isArchived");
  // getting username and api key

  function saveUserName() {
    newUserName();
    setSavedUserName(true);
  }
  function newUserName() {
    setUserName(userName);
  }

  function saveApiKey() {
    newApiKey();
    setSavedApiKey(true);
  }
  function newApiKey() {
    setApiKey(apiKey);
  }

  //functions for outer columns

  function newColumns(name) {
    const newColumns = {
      name: name,
      id: nanoid(),
      select: true,
      pick: false,
      show: false,
      called: false,
      highlight: false,
      count: 0,
      issue: [],
    };
    columns.push(newColumns);
    setColumns([...columns]);
  }

  useEffect(() => {
    let columns = [
      {
        id: "column-1",
        name: "Todo",
        issue: [],
      },
      {
        id: "column-2",
        name: "In Progress",
        issue: [],
      },
      {
        id: "column-3",
        name: "Done",
        issue: [],
      },
    ];

    setColumns(
      columns.map((d) => {
        return {
          pick: false,
          select: true,
          id: d.id,
          name: d.name,
          show: false,
          tables: "",
          called: false,
          highlight: false,
          count: 0,
          issue: d.issue,
        };
      })
    );
  }, []);

  function DropItem(id) {
    onClick2();
    setColumns((column) =>
      column.map((column) => {
        return id === column.id
          ? {
              ...column,
              pick: !column.pick,
              highlight: false,
              called: false,
              show: false,
              issue: column.issue.map((issue) => {
                return {
                  ...issue,
                  pick: false,
                  selection: false,
                  selection2: false,
                  shownRepositories: true,
                };
              }),
            }
          : {
              ...column,
              show: false,
              pick: false,
              highlight: false,
              called: false,
              issue: column.issue.map((issue) => {
                return {
                  ...issue,
                  pick: false,
                  selection: false,
                  selection2: false,
                  shownRepositories: true,
                };
              }),
            };
      })
    );
  }

  function hideSpecificColumn(id) {
    onClick2();
    const hideColumn = columns.map((column) => {
      if (id === column.id) {
        return { ...column, select: false };
      }
      return column;
    });
    setColumns(hideColumn);
  }

  function handleAllShow(id) {
    onClick2();
    setShowss(false);
    const handleAllShow = columns.map((column) => {
      if (id === column.id) {
        return {
          ...column,
          show: true,
          highlight: false,
          pick: false,
          called: false,
          issue: column.issue.map((issue) => {
            return {
              ...issue,
              pick: false,
              selection: false,
              selection2: false,
              shownRepositories: true,
            };
          }),
        };
      }
      return {
        ...column,
        show: false,
        pick: false,
        highlight: false,
        called: false,
        issue: column.issue.map((issue) => {
          return {
            ...issue,
            pick: false,
            selection: false,
            selection2: false,
            shownRepositories: true,
          };
        }),
      };
    });
    setColumns(handleAllShow);
  }

  function deleteSpecificItem(id) {
    const deleteSpecificItem = columns.filter((column) => id !== column.id);

    setColumns(deleteSpecificItem);
  }

  function AddItem(id) {
    onClick2();
    let updateColumns = columns.map((column) => {
      if (id === column.id) {
        return { ...column, called: false, highlight: false };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function newIssue(id, valueCollected) {
    onClick2();
    let newIssue = {
      pick: false,
      id: nanoid(),
      selection: false,
      tables: valueCollected,
      selection2: false,
      shownRepositories: true,
      issueCreated: true,
      isArchived: false,
      archiveDropdownMenu: false,
      dataRepositoryUrl: "",
      currentRepoName: "",
      issueNumber: "",
      lastExecutedTime: null, 
      timeSinceLastExecution: null,
    };

    let updateColumns = columns.map((column) => {
      if (id === column.id) {
        return {
          ...column,
          called: false,
          highlight: false,
          issue: [...column.issue, newIssue],
        };
      }

      return column;
    });
    setColumns(updateColumns);
  }

  function deleteItem2(id, columnId) {
    onClick2();
    let updateColumns = columns.map((column) => {
      console.log(id, columnId, column.id);
      if (columnId === column.id) {
        return {
          ...column,
          issue: column.issue.filter((item) => id != item.id),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function deleteItem3(columnId, id) {
    // onClick2();
    let updateColumns = columns.map((column) => {
      console.log(id, columnId, column.id);
      if (columnId === column.id) {
        column.issue = column.issue.filter((item) => item.id !== id);
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function deleteAllItem(id, columnId) {
    let updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          issue: column.issue.filter((item) => id !== item.id && id == item.id),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function section(id, columnId) {
    let updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          issue: column.issue.map((issue) => {
            if (id === issue.id) {
              return { ...issue, selection: true };
            }
            return { ...issue };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function section2(id, pick, columnId) {
    let updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          issue: column.issue.map((issue) => {
            if (id === issue.id && pick === true) {
              return { ...issue, selection: true, pick: true };
            } else if (id === issue.id && pick === false) {
              return { ...issue, selection: false, pick: false };
            }
            return { ...issue };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function dropItem2(id, columnId) {
    setShowss(false);
    onClick2();
    let updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          highlight: false,
          called: false,
          show: false,
          pick: false,
          issue: column.issue.map((issue) => {
            if (id === issue.id) {
              return { ...issue, pick: !issue.pick, shownRepositories: true };
            }
            return { ...issue, selection: false, pick: false };
          }),
        };
      } else if (columnId !== column.id) {
        return {
          ...column,
          highlight: false,
          called: false,
          show: false,
          pick: false,
          issue: column.issue.map((issue) => {
            return { ...issue, pick: false };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function ArchiveDropdown(columnId, id) {
    setShowss(false);
    onClick2();
    let updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          highlight: false,
          called: false,
          show: false,
          pick: false,
          issue: column.issue.map((issue) => {
            if (id === issue.id) {
              return {
                ...issue,
                archiveDropdownMenu: !issue.archiveDropdownMenu,
              };
            }
            return {
              ...issue,
              selection: false,
              pick: false,
              archiveDropdownMenu: false,
            };
          }),
        };
      } else if (columnId !== column.id) {
        return {
          ...column,
          highlight: false,
          called: false,
          show: false,
          pick: false,
          issue: column.issue.map((issue) => {
            return { ...issue, pick: false, archiveDropdownMenu: false };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function changeIssueCreatedState(id, columnId, issueCreated) {
    let updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          issue: column.issue.map((issue) => {
            if (id === issue.id) {
              return { ...issue, issueCreated: false, pick: false };
            }
            return { ...issue };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function archiveItem(id, columnId) {
    onClick2();
    let updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          issue: column.issue.map((issue) => {
            if (id === issue.id) {
              return {
                ...issue,
                isArchived: true,
                lastExecutedTime: Date.now(),
                timeSinceLastExecution: null,
              };
            }
            return { ...issue };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
   
  }



  /*  setTimeout(() => {
    const updatedItems = columns.map(column => {
      column.issue.map(issue => {
       if (issue.lastExecutedTime) {
        const currentTime = new Date();
        const timeDifference = currentTime - issue.lastExecutedTime;
        return {
          ...issue,
          timeSinceLastExecution: `${Math.round(timeDifference / (1000 * 60 * 60))} hours ago`
        };
      }
      return issue;
    })});
        setColumns(updatedItems);
  }, [columns]); */

 

  function unArchiveItem(columnId, id) {
    onClick2();
    let updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          issue: column.issue.map((issue) => {
            console.log(columnId, column.id, issue.id, id, issue.isArchived);
            if (id === issue.id) {
              issue.isArchived = false;
            }
            return issue;
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function archiveItem2(columnId) {
    let updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          pick: false,
          issue: column.issue.map((issue) => {
            return { ...issue, isArchived: true };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function showRepositories(id, columnId) {
    setShowss(false);
     setFetchData(data=>!data);
    const updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          issue: column.issue.map((issue) => {
            if (id === issue.id) {
              return { ...issue, shownRepositories: false };
            }
            return { ...issue, shownRepositories: true };
          }),
        };
      } else if (columnId !== column.id) {
        return {
          ...column,
          issue: column.issue.map((issue) => {
            return { ...issue, shownRepositories: true };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function closeAll3(id) {
    const updateColumns = columns.map((column) => {
      if (id === column.id) {
        return {
          ...column,
          issue: column.issue.map((issue) => {
            return { ...column.issue, selection: false, pick: false };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function closeAll2(id, columnId) {
    const updateColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          issue: column.issue.map((issue) => {
            if (id === issue.id) {
              return { ...issue, selection: true, pick: false };
            }
            return { ...issue, selection: false, pick: false };
          }),
        };
      }
      return column;
    });
    setColumns(updateColumns);
  }

  function updateColumn(id, name) {
    const updatedColumns = columns.map((column) => {
      if (id === column.id) {
        return { ...column, name: name, show: false };
      }
      return column;
    });
    setColumns(updatedColumns);
  }

  let result1 = columns.every(function (e) {
    return e.select === false;
  });

  let result2 = columns.every(function (e) {
    return e.select === true;
  });

  function Visible() {
    return (
      <div>
        <div className="title">{result1 ? "" : "Visible column(s)"}</div>
        {columns.map((d) => {
          const style = {
            display: d.select ? "block" : "none",
          };

          d.pick = false;
          return (
            <h4 key={d.id} style={style}>
              {" "}
              <input
                className="input"
                type="checkbox"
                name=""
                checked={d.select}
                onChange={(event) => {
                  let checked = event.target.checked;
                  setColumns(
                    columns.map((data) => {
                      if (d.id === data.id) {
                        data.select = checked;
                      }
                      return data;
                    })
                  );
                }}
              />
              <label className="label" htmlFor={d.id}>
                {d.name}
              </label>
            </h4>
          );
        })}
      </div>
    );
  }

  function Hidden() {
    return (
      <div>
        <div className="title">{result2 ? "" : "Hidden column(s)"}</div>
        {columns.map((d) => {
          const style = {
            display: d.select ? "none" : "block",
          };

          d.pick = false;
          return (
            <h4 key={d.id} style={style}>
              <input
                className="input"
                type="checkbox"
                name=""
                id={d.id}
                checked={d.select}
                onChange={(event) => {
                  let checked = event.target.checked;
                  setColumns(
                    columns.map((data) => {
                      if (d.id === data.id) {
                        data.select = checked;
                      }
                      return data;
                    })
                  );
                }}
              />{" "}
              <label className="label" htmlFor={d.id}>
                {d.name}
              </label>
            </h4>
          );
        })}
      </div>
    );
  }

  function openInput(id) {
    setShowss(false);
    const specifiedInput = columns.map((column) => {
      if (id === column.id) {
        return {
          ...column,
          called: true,
          highlight: true,
          pick: false,
          show: false,
          issue: column.issue.map((issue) => {
            return {
              ...issue,
              pick: false,
              selection: false,
              selection2: false,
              shownRepositories: true,
            };
          }),
        };
      }
      return {
        ...column,
        pick: false,
        called: false,
        highlight: false,
        show: false,
        issue: column.issue.map((issue) => {
          return {
            ...issue,
            pick: false,
            selection: false,
            selection2: false,
            shownRepositories: true,
          };
        }),
      };
    });
    setColumns(specifiedInput);
  }

  function closeInput() {
    const closeAllInput = columns.map((column) => {
      return { ...column, called: false };
    });
    setColumns(closeAllInput);
  }

  //implementing the draggable function

  const onDragEnd = (result) => {
    // check if the draggable is dropped outside of the droppable
    if (!result.destination) {
      return;
    }

    // get the source and destination columns
    const sourceColumn = columns.find(
      (col) => col.id === result.source.droppableId
    );
    const destColumn = columns.find(
      (col) => col.id === result.destination.droppableId
    );

    // if the item is dropped in the same column, just reorder the items
    if (result.source.droppableId === result.destination.droppableId) {
      const newIssue = Array.from(sourceColumn.issue);
      const [removed] = newIssue.splice(result.source.index, 1);
      newIssue.splice(result.destination.index, 0, removed);

      const newColumn = {
        ...sourceColumn,
        issue: newIssue,
      };

      const newData = columns.map((col) => {
        if (col.id === result.source.droppableId) {
          return newColumn;
        }
        return col;
      });

      setColumns(newData);
    } else {
      // if the item is dropped in a different column, remove the item from the source column
      // and add it to the destination column
      const sourceTaskIds = [...sourceColumn.issue];
      const destTaskIds = [...destColumn.issue];
      const [removed] = sourceTaskIds.splice(result.source.index, 1);
      destTaskIds.splice(result.destination.index, 0, removed);
      const newData = columns.map((col) => {
        if (col.id === result.source.droppableId) {
          return { ...col, issue: sourceTaskIds };
        }
        if (col.id === result.destination.droppableId) {
          return { ...col, issue: destTaskIds };
        }
        return col;
      });
      setColumns(newData);
    }
  };

  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  function closeAll() {
    setShowss(false);
    const handleAllShow = columns.map((column) => {
      return {
        ...column,
        show: false,
        pick: false,
        highlight: false,
        called: false,
        issue: column.issue.map((issue) => {
          return {
            ...issue,
            pick: false,
            selection: false,
            selection2: false,
            shownRepositories: true,
            archiveDropdownMenu: false,
          };
        }),
      };
    });
    setColumns(handleAllShow);
  }

  const [savedUserName, setSavedUserName] = useState(false);
  const [savedApiKey, setSavedApiKey] = useState(false);
  const [userName, setUserName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const res = await fetch(`https://api.github.com/users/${owner}/repos`);
      const data = await res.json();
      //console.log(data.name, data.id);

      setItems(data);
    };
    fetchRepos();
  }, [fetchdata]);


  const currentApiKey =
    apiKey === "" ? "" : apiKey;

  const octokit = new Octokit({
    auth: currentApiKey,
  });

  const owner = userName === "" ? "Dikeprosper123" : userName;

  const postIssue = async (itemId, id, columnId, tables) => {
    const repo = items.map((item) => {
      if (itemId === item.id) {
        console.log(item.name);
        return item.name;
      }
    });

    const res = await octokit
      .request("POST https://api.github.com/repos/{owner}/{repo}/issues", {
        owner: owner,
        repo: repo,
        title: tables,
      })
      .then((res) => {
        if (res.status === 201) {
          console.log(res.data);
          const updateColumns = columns.map((column) => {
            if (columnId === column.id) {
              return {
                ...column,
                issue: column.issue.map((issue) => {
                  if (id === issue.id) {
                    return {
                      ...issue,
                      pick: false,
                      currentRepoName: repo,
                      dataRepositoryUrl: res.data.html_url,
                      issueNumber: res.data.number,
                      issueCreated: false,
                    };
                  }
                  return { ...issue };
                }),
              };
            }
            return column;
          });
          setColumns(updateColumns);

          alert(`issue created at ${res.data.html_url}`);
        } else {
          alert(`something went wrong. Response: ${JSON.stringify(res)}`);
        }
      });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {
        <div className="body">
          <div className="body1">
            <div style={{ position: "sticky", left: "0" }}>
              <div className="form-input-username1">
                {" "}
                <div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveUserName();
                    }}
                  >
                    <div className="">
                      <input
                        autoFocus
                        className="form-input-username2"
                        id="name"
                        placeholder="Enter your username"
                        type="text"
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="form-input-username3" onClick={saveUserName}>
                  {savedUserName ? "saved" : "save"}
                </div>
              </div>

              <div className="form-input-username1">
                {" "}
                <div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveApiKey();
                    }}
                  >
                    <div className="">
                      <input
                        autoFocus
                        className="form-input-username2"
                        id="api key"
                        placeholder="Enter your Api-key"
                        type="text"
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="form-input-username3" onClick={saveApiKey}>
                  {savedApiKey ? "saved" : "save"}
                </div>
              </div>
            </div>

            {archivedState ? (
              <>
                <div style={{ position: "sticky", left: "0" }}>
                  <button
                    className="archived-button"
                    onClick={() => setArchivedState(false)}
                  >
                    View Archived Items
                  </button>
                </div>
                <div className="drop-down">
                  <div className="drop-down51" ref={menuRef}>
                    <div className="total-column">
                      {columns.map((column, index) => {
                        return (
                          <Column
                            key={column.id}
                            {...column}
                            index={index}
                            column={column}
                            onClick={() => DropItem(column.id)}
                            updateColumn={updateColumn}
                            hideSpecificColumn={hideSpecificColumn}
                            handleAllShow={handleAllShow}
                            deleteSpecificItem={deleteSpecificItem}
                            Hidden={Hidden}
                            Visible={Visible}
                            AddItem={AddItem}
                            openInput={openInput}
                            closeInput={closeInput}
                            closeAll={closeAll}
                            newIssue={newIssue}
                            deleteItem2={deleteItem2}
                            section={section}
                            section2={section2}
                            closeAll3={closeAll3}
                            closeAll2={closeAll2}
                            dropItem2={dropItem2}
                            showRepositories={showRepositories}
                            changeIssueCreatedState={changeIssueCreatedState}
                            archiveItem={archiveItem}
                            onClick3={dropItem2}
                            archiveItem2={archiveItem2}
                            deleteAllItem={deleteAllItem}
                            items={items}
                            postIssue={postIssue}
                          />
                        );
                      })}
                      ;
                    </div>
                    {dropDown ? (
                      <DropDownItem
                        newColumns={newColumns}
                        Hidden={Hidden}
                        Visible={Visible}
                        handleShowss={handleShowss}
                        showss={showss}
                        hideShowss={hideShowss}
                      />
                    ) : (
                      <button className="add-button" onClick={onClick1}>
                        +
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="archive-container">
                <div className="archive-container1">
                  {" "}
                  <BiArrowBack onClick={() => setArchivedState(true)} /> &nbsp;
                  &nbsp;Archive
                </div>
                <div className="note">You can click on any empty area on your screen to update the time a task was archived if a task is archived</div>
                <div className="archive-container2">
                  <div className="archive-container3" ref={menuRef}>
                    
                    <div className="archive-container4" onClick={closeAll}>
                      {" "}
                      <div> {totalLength} archived item</div>
                    </div>
                    {totalLength === 0 ? (
                      <div className="archived-container11">
                        <HiOutlineArchive className="icons-archived-container11" />
                        <h4>There aren't any archived items</h4>
                        <p>
                          Archive items from a project view and they'll be shown
                          here.
                        </p>
                      </div>
                    ) : null}
                    {columns.map((column) => (
                      <Archived
                        key={column.id}
                        {...column}
                        unArchiveItem={unArchiveItem}
                        ArchiveDropdown={ArchiveDropdown}
                        deleteItem3={deleteItem3}
                        closeAll={closeAll}
                        userName={userName}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    </DragDropContext>
  );
}

export default App;
