import Box from "@mui/material/Box";
import {
  type GridColDef,
  type GridRowId,
  type GridRowModel,
  type GridRowModesModel,
  type GridEventListener,
  GridRowEditStopReasons,
  GridRowModes,
  GridActionsCellItem,
  DataGrid,
} from "@mui/x-data-grid";
import styles from "../../../src/styles/styles.module.css";
import Paper from "@mui/material/Paper";
import Alert, { type AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

const DeleteUserAlert = dynamic(() => import("./DeleteUserAlert"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});


interface User {
  id: GridRowId;
  userName: string;
  role: boolean;
  likes: number;
}
const GET_USERS = gql`
  query Users($token: String!) {
    users(token: $token) {
      id
      role
      username
      likes
    }
  }
`;

const MODIFY_USER = gql`
  mutation Mutation($user: modifyUserAsAdminInput, $modifyUser: ModifyUserWithTokenAndRoleInput) {
    modifyUserAsAdmin(user: $user, modifyUser: $modifyUser) {
      user {
        role
      }
      message
    }
  }
`;

const useModifyUserAsAdmin = (token: string, user: User) => {
  const [modifyUserAsAdmin] = useMutation(MODIFY_USER);

  return useCallback(() => {
    modifyUserAsAdmin({
      variables: {
        user: {
          token: token,
        },
        modifyUser: {
          role: user.role ? "Admin" : "User",
          id: user.id?.toString() || "",
        },
      },
    });
  }, [modifyUserAsAdmin, token, user]);
};

const useGetUsersData = (token: string) => {
  const { data: usersData } = useQuery(GET_USERS, {
    variables: { token },
    skip: !token,
  });

  return useMemo(
    () =>
      usersData?.users.map((user: any, index: number) => ({
        ...user,
        tunnus: index,
        role: user.role?.toLowerCase() === "admin",
      })),
    [usersData],
  );
};

const useWindowResize = (callback: () => void) => {
  useEffect(() => {
    window.addEventListener("resize", callback);
    callback();

    return () => {
      window.removeEventListener("resize", callback);
    };
  }, [callback]);
};

const useHandleUserModification = (modifyUserID: string, token: string, isAdmin: string) => {
  const handleUserModification = useModifyUserAsAdmin(token, {
    id: modifyUserID,
    role: isAdmin === "Admin",
  } as User);

  useEffect(() => {
    if (modifyUserID) handleUserModification();
  }, [modifyUserID, handleUserModification]);
};

const UsersGrid = () => {
  const session = useSession();
  const token = session.data?.token as string;
  const usersWithId = useGetUsersData(token);
  const [userGrid, setUserGrid] = useState<any[]>([]);
  const [isDeleteUser, setDeleteUser] = useState(false);
  const [userId, setDeleteUserId] = useState("");
  const [, setIsMobile] = useState(false);
  const [, setButtonLocation] = useState(true);
  const [modifyUserID, setModifyUserID] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<string>("");
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    if (usersWithId) setUserGrid(usersWithId);
  }, [usersWithId]);

  const handleResize = useCallback(() => {
    const isWide = window.innerWidth > 1000;
    setIsMobile(isWide);
    setButtonLocation(!isWide);
  }, []);

  useWindowResize(handleResize);
  useHandleUserModification(modifyUserID, token, isAdmin);

  const editUserState = useCallback(
    (user: Partial<User>) =>
      new Promise<Partial<User>>((resolve, reject) => {
        setTimeout(() => {
          if (session.data?.user?.id === user.id) {
            reject(new Error("Et voi muuttaa omaa rooliasi!"));
          } else {
            const role = user.role ? "Admin" : "User";
            setIsAdmin(role);
            setModifyUserID(user.id?.toString() || "");
            resolve({ ...user });
          }
        }, 200);
      }),
    [session],
  );

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

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const mutateRow = editUserState;

  const [snackbar, setSnackbar] = useState<Pick<AlertProps, "children" | "severity"> | null>(null);

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
      field: "likes",
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

            <GridActionsCellItem key={id} icon={<CancelIcon />} label="Cancel" className="textPrimary" onClick={handleCancelClick(id)} color="inherit" />,
          ];
        }
        return [
          <GridActionsCellItem icon={<EditIcon />} key={id} label="Edit" className="textPrimary" onClick={handleEditClick(id)} color="inherit" />,
          <GridActionsCellItem icon={<DeleteIcon />} key={id} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />,
        ];
      },
    },
  ];

  return (
    <div className={styles.userContent}>
      {isDeleteUser && (
        <DeleteUserAlert isOpen={isDeleteUser} userId={userId} setUsers={setUserGrid} userGrid={userGrid} setDeleteUser={setDeleteUser} token={token} />
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
              toolbar: { setUserGrid, setRowModesModel },
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

export default UsersGrid;
