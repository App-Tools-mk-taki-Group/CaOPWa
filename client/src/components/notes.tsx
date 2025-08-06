import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Search, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Tag,
  Calendar,
  FileText,
  Keyboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VirtualKeyboard } from "./virtual-keyboard";
import type { Note, InsertNote } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const COSMIC_GRADIENTS = [
  "from-purple-500/20 to-blue-600/20",
  "from-blue-500/20 to-cyan-600/20", 
  "from-green-500/20 to-teal-600/20",
  "from-yellow-500/20 to-orange-600/20",
  "from-pink-500/20 to-purple-600/20",
  "from-indigo-500/20 to-blue-600/20"
];

interface EditingNote {
  id?: string;
  title: string;
  content: string;
  tags: string[];
}

export function Notes() {
  const [editingNote, setEditingNote] = useState<EditingNote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTarget, setKeyboardTarget] = useState<'title' | 'content' | 'tag' | null>(null);
  
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch notes
  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ['/api/notes'],
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: (note: InsertNote) => 
      fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setEditingNote(null);
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: Partial<InsertNote> }) =>
      fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setEditingNote(null);
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => 
      fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    },
  });

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateNote = () => {
    setEditingNote({
      title: "",
      content: "",
      tags: []
    });
  };

  const handleEditNote = (note: Note) => {
    setEditingNote({
      id: note.id,
      title: note.title,
      content: note.content,
      tags: note.tags || []
    });
  };

  const handleSaveNote = () => {
    if (!editingNote || !editingNote.title.trim()) return;

    const noteData: InsertNote = {
      title: editingNote.title.trim(),
      content: editingNote.content.trim(),
      tags: editingNote.tags.filter(tag => tag.trim() !== "")
    };

    if (editingNote.id) {
      updateNoteMutation.mutate({ id: editingNote.id, note: noteData });
    } else {
      createNoteMutation.mutate(noteData);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !editingNote) return;
    
    const tag = newTag.trim();
    if (!editingNote.tags.includes(tag)) {
      setEditingNote({
        ...editingNote,
        tags: [...editingNote.tags, tag]
      });
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingNote) return;
    setEditingNote({
      ...editingNote,
      tags: editingNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyboardInput = (key: string) => {
    if (!keyboardTarget || !editingNote) return;

    switch (keyboardTarget) {
      case 'title':
        setEditingNote({
          ...editingNote,
          title: editingNote.title + key
        });
        break;
      case 'content':
        setEditingNote({
          ...editingNote,
          content: editingNote.content + key
        });
        break;
      case 'tag':
        setNewTag(newTag + key);
        break;
    }
  };

  const handleKeyboardBackspace = () => {
    if (!keyboardTarget || !editingNote) return;

    switch (keyboardTarget) {
      case 'title':
        setEditingNote({
          ...editingNote,
          title: editingNote.title.slice(0, -1)
        });
        break;
      case 'content':
        setEditingNote({
          ...editingNote,
          content: editingNote.content.slice(0, -1)
        });
        break;
      case 'tag':
        setNewTag(newTag.slice(0, -1));
        break;
    }
  };

  const handleKeyboardSpace = () => {
    if (!keyboardTarget || !editingNote) return;

    switch (keyboardTarget) {
      case 'title':
        setEditingNote({
          ...editingNote,
          title: editingNote.title + ' '
        });
        break;
      case 'content':
        setEditingNote({
          ...editingNote,
          content: editingNote.content + ' '
        });
        break;
      case 'tag':
        setNewTag(newTag + ' ');
        break;
    }
  };

  const openKeyboard = (target: 'title' | 'content' | 'tag') => {
    setKeyboardTarget(target);
    setShowKeyboard(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Notes List */}
          <div className="lg:w-1/2">
            <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 shadow-2xl shadow-blue-500/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Cosmic Notes
                  </CardTitle>
                  <Button
                    onClick={handleCreateNote}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid="button-create-note"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Note
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                  <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-blue-500/30 text-blue-100 placeholder-blue-300/50"
                    data-testid="input-search-notes"
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-96">
                  {isLoading ? (
                    <div className="text-center text-blue-300 py-8">Loading notes...</div>
                  ) : filteredNotes.length === 0 ? (
                    <div className="text-center text-blue-300 py-8">
                      {searchTerm ? "No notes found" : "No notes yet. Create your first note!"}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredNotes.map((note, index) => (
                        <Card
                          key={note.id}
                          className={cn(
                            "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
                            "bg-gradient-to-br border-slate-600/50 hover:border-blue-400/50",
                            COSMIC_GRADIENTS[index % COSMIC_GRADIENTS.length]
                          )}
                          onClick={() => handleEditNote(note)}
                          data-testid={`card-note-${note.id}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-blue-100 mb-2 line-clamp-1">
                                  {note.title}
                                </h3>
                                <p className="text-sm text-blue-200/70 line-clamp-2 mb-2">
                                  {note.content}
                                </p>
                                
                                {note.tags && note.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {note.tags.slice(0, 3).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-xs bg-blue-500/20 text-blue-200 border-blue-400/30"
                                      >
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                      </Badge>
                                    ))}
                                    {note.tags.length > 3 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-slate-500/20 text-slate-300"
                                      >
                                        +{note.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2 text-xs text-blue-300/60">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(note.updated_at || note.created_at!).toLocaleDateString()}
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNoteMutation.mutate(note.id);
                                }}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                data-testid={`button-delete-${note.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Note Editor */}
          <div className="lg:w-1/2">
            {editingNote ? (
              <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 shadow-2xl shadow-blue-500/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-100 flex items-center gap-2">
                      <Edit className="w-5 h-5 text-blue-400" />
                      {editingNote.id ? 'Edit Note' : 'New Note'}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowKeyboard(!showKeyboard)}
                        size="sm"
                        variant="outline"
                        className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                        data-testid="button-toggle-keyboard"
                      >
                        <Keyboard className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleSaveNote}
                        size="sm"
                        disabled={!editingNote.title.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        data-testid="button-save-note"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingNote(null)}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        data-testid="button-cancel-edit"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor="note-title" className="text-blue-200 mb-2 block">
                      Title
                    </Label>
                    <div className="relative">
                      <Input
                        id="note-title"
                        ref={titleRef}
                        value={editingNote.title}
                        onChange={(e) => setEditingNote({
                          ...editingNote,
                          title: e.target.value
                        })}
                        placeholder="Enter note title..."
                        className="bg-slate-800/50 border-blue-500/30 text-blue-100 placeholder-blue-300/50"
                        data-testid="input-note-title"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openKeyboard('title')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                        data-testid="button-keyboard-title"
                      >
                        <Keyboard className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <Label htmlFor="note-content" className="text-blue-200 mb-2 block">
                      Content
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="note-content"
                        ref={contentRef}
                        value={editingNote.content}
                        onChange={(e) => setEditingNote({
                          ...editingNote,
                          content: e.target.value
                        })}
                        placeholder="Write your note content..."
                        className="min-h-[200px] bg-slate-800/50 border-blue-500/30 text-blue-100 placeholder-blue-300/50 resize-none"
                        data-testid="textarea-note-content"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openKeyboard('content')}
                        className="absolute right-2 top-2 text-blue-400 hover:text-blue-300"
                        data-testid="button-keyboard-content"
                      >
                        <Keyboard className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-slate-600" />

                  {/* Tags */}
                  <div>
                    <Label className="text-blue-200 mb-2 block">Tags</Label>
                    
                    {/* Add Tag */}
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Input
                          ref={tagRef}
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add tag..."
                          className="bg-slate-800/50 border-blue-500/30 text-blue-100 placeholder-blue-300/50"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          data-testid="input-new-tag"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openKeyboard('tag')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                          data-testid="button-keyboard-tag"
                        >
                          <Keyboard className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleAddTag}
                        size="sm"
                        disabled={!newTag.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        data-testid="button-add-tag"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Tag List */}
                    {editingNote.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editingNote.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-blue-500/20 text-blue-200 border-blue-400/30 pr-1"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 h-4 w-4 p-0 text-blue-300 hover:text-red-300"
                              data-testid={`button-remove-tag-${tag}`}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30 shadow-2xl shadow-blue-500/10">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center text-blue-300">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                    <p className="text-lg mb-2">No note selected</p>
                    <p className="text-sm text-blue-300/70">
                      Select a note to edit or create a new one
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        visible={showKeyboard}
        onKeyPress={handleKeyboardInput}
        onBackspace={handleKeyboardBackspace}
        onSpace={handleKeyboardSpace}
        onClose={() => setShowKeyboard(false)}
      />
    </div>
  );
}