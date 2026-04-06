import { useState } from "react";
import { useUsers } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import API from "@/services/api";
import type { User } from "@/types/roaster";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";

const Members = () => {
  const { users, fetchUsers, updateUser, deleteUser } = useUsers();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Add member state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  });

  // Edit member state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "user",
  });

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddChange = (field: string, value: string) => {
    setAddForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    setError("");
    setSuccess("");

    if (!addForm.userId.trim() || !addForm.name.trim() || !addForm.email.trim() || !addForm.password.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      await API.post("/auth/register", {
        userId: addForm.userId.trim(),
        name: addForm.name.trim(),
        email: addForm.email.trim(),
        password: addForm.password,
        role: addForm.role,
      });
      setSuccess("Member added successfully");
      setAddForm({ userId: "", name: "", email: "", password: "", role: "user" });
      setShowAddModal(false);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const startEdit = (u: User) => {
    setEditingUser(u);
    setEditForm({
      name: u.name,
      email: u.email || "",
      role: (u.role as "admin" | "user") || "user",
    });
    setError("");
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!editingUser) return;
    setError("");

    if (!editForm.name.trim() || !editForm.email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      await updateUser(editingUser.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
      });
      setSuccess("Member updated successfully");
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update member");
    }
  };

  const startDelete = (u: User) => {
    setDeletingUser(u);
    setError("");
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setError("");

    try {
      await deleteUser(deletingUser.id);
      setSuccess("Member deleted successfully");
      setShowDeleteModal(false);
      setDeletingUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete member");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Members</h2>
        {isAdmin && (
          <Button
            onClick={() => {
              setShowAddModal(true);
              setError("");
              setSuccess("");
            }}
          >
            + Add Member
          </Button>
        )}
      </div>

      {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

      {users.length === 0 ? (
        <p className="text-muted-foreground">No members found.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Availability</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="text-muted-foreground font-medium">{u.id}</TableCell>
                    <TableCell className="text-muted-foreground">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === "admin" ? "default" : "outline"}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.isAvailableNextWeek ? "default" : "destructive"}>
                        {u.isAvailableNextWeek ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="icon" onClick={() => startEdit(u)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => startDelete(u)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add Member Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>User ID (username)</Label>
              <Input
                placeholder="User ID"
                value={addForm.userId}
                onChange={(e) => handleAddChange("userId", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Name"
                value={addForm.name}
                onChange={(e) => handleAddChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={addForm.email}
                onChange={(e) => handleAddChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password"
                value={addForm.password}
                onChange={(e) => handleAddChange("password", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={addForm.role} onValueChange={(val) => handleAddChange("role", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input value={editingUser?.id || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={editForm.role} onValueChange={(val) => setEditForm(prev => ({ ...prev, role: val as "admin" | "user" }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
          </DialogHeader>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <p className="text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold text-foreground">{deletingUser?.name}</span> ({deletingUser?.id})? This action cannot be undone.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;
