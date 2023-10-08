import Box from "@mui/material/Box";
import {
  DataGrid,
  GridRowModes,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowModesModel,
  GridRowsProp,
  GridEventListener,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import styles from "../../src/styles/styles.module.css";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DeleteUserAlert from "./DeleteUserAlert";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useNavBar } from "~/pages/api/NavBarProvider";

interface User {
  id: GridRowId;
  userName: string;
  role: boolean;
}
const GET_USERS = gql(`query Users($token: String!) {
          users(token: $token) {
            id
            role
            username
        }
}`);

const MODIFY_USER =
  gql(`mutation Mutation($user: modifyUserAsAdminInput, $modifyUser: ModifyUserWithTokenAndRoleInput) {
  modifyUserAsAdmin(user: $user, modifyUser: $modifyUser) {
    user {
      role
    }
    message
  }
}`);

const UserGrid = () => {
  const [userGrid, setUsers] = useState<any[]>([]);
  const [isDeleteUser, setDeleteUser] = useState(false);
  const [userId, setDeleteUserId] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [buttonLocation, setButtonLocation] = useState(true);
  const { isNavBarOpen, openNavBar, closeNavBar } = useNavBar();
  const session = useSession();
  const [token, setToken] = useState<string>("");
  const [modifyUserID, setModifyUserID] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<string>("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const users = useQuery(GET_USERS, {
    variables: {
      token: token,
    },
    onCompleted: ({ users }) => {
      const usersWithId = users.map((user: any, index: number) => {
        return {
          ...user,
          tunnus: index,
          role: user.role?.toLowerCase() === "admin" ? true : false,
        };
      });
      setUsers(usersWithId);
    },
  });

  const [modifyUserAsAdmin] = useMutation(MODIFY_USER, {
    variables: {
      user: {
        token: token,
      },
      modifyUser: {
        role: isAdmin,
        id: modifyUserID,
      },
    },
    onCompleted: ({ modifyUserAsAdmin }) => {},
  });

  const editUserState = () => {
    return useCallback(
      (user: Partial<User>) =>
        new Promise<Partial<User>>((resolve, reject) => {
          setTimeout(() => {
            try {
              if (session.data?.user.id === user.id) {
                reject(new Error("Et voi muuttaa omaa rooliasi!"));
              } else {
                if (user.role === true) {
                  setIsAdmin("Admin");
                  setModifyUserID(user.id?.toString() || ""); // convert to string before setting state
                } else {
                  setIsAdmin("User");
                  setModifyUserID(user.id?.toString() || ""); // convert to string before setting state
                }
              }
            } catch (err) {
              reject(new Error("Käyttäjän tallennus epäonnistui!"));
            }
            resolve({
              ...user,
            });
          }, 200);
        }),
      [],
    );
  };

  useEffect(() => {
    if (modifyUserID ) {
      modifyUserAsAdmin();
    }
  }, [modifyUserID]);

  const handleDeleteClick = (id: GridRowId) => () => {
    userGrid.map((user: any) => {
      if (user.id === id) {
        setDeleteUserId(user.id);
      }
    });
    setDeleteUser(true);
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit },
    });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const mutateRow = editUserState();

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel) => {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow);
      setSnackbar({
        children: "Käyttäjä tallennettu onnistuneesti!",
        severity: "success",
      });
      return response;
    },
    [mutateRow],
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth > 1000);
      if (window.innerWidth > 1000) {
        setButtonLocation(false);
      } else {
        setButtonLocation(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getUsersData();
  }, [session]);

  const getUsersData = async () => {
    const token = session.data?.user?.token as string;
    setToken(token);
    await users.refetch();
    // Delete the users id and change the id to index.
  };

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const columns: GridColDef[] = [
    { field: "tunnus", headerName: "Tunnus", width: 200 },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      editable: false,
    },
    {
      field: "LikeCount",
      headerName: "Like count",
      width: 200,
      editable: false,
    },
    {
      field: "role",
      headerName: "Admin",
      type: "boolean",
      width: 200,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Toiminnot",
      width: 300,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              key={id}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,

            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            key={id}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            key={id}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className={styles.userContent}>
      {isDeleteUser && (
        <DeleteUserAlert
          isOpen={isDeleteUser}
          userId={userId}
          setUsers={setUsers}
          userGrid={userGrid}
          setDeleteUser={setDeleteUser}
          token={token}
        />
      )}
      <Paper
        className={styles.MuiPaper}
        elevation={3}
        style={{
          borderRadius: 25,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "79vh",
            width: "96%",
            border: "none",
            marginLeft: "2%",
          }}
        >
          <DataGrid
            rows={userGrid}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            slotProps={{
              toolbar: { setUsers, setRowModesModel },
            }}
            pageSizeOptions={[8]}
            sx={{ border: "none" }}
          />
          {!!snackbar && (
            <Snackbar
              open
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              onClose={handleCloseSnackbar}
              autoHideDuration={6000}
            >
              <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default UserGrid;
