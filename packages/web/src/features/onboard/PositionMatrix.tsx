import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PositionMatrixProps {
  positionMatrix: {
    archetype: string;
    skills: string[];
    projects: Array<{
      name: string;
      description: string;
      url?: string;
    }>;
    goals: string;
    idealCollaborator: string;
    notes: string;
  };
  editable?: boolean;
  onChange?: (updatedMatrix: any) => void;
}

export function PositionMatrix({ positionMatrix, editable = false, onChange }: PositionMatrixProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMatrix, setEditedMatrix] = useState(positionMatrix);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditedMatrix(positionMatrix);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(editedMatrix);
    }
  };
  
  const handleChange = (field: string, value: any) => {
    setEditedMatrix(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...editedMatrix.skills];
    updatedSkills[index] = value;
    handleChange('skills', updatedSkills);
  };
  
  const addSkill = () => {
    handleChange('skills', [...editedMatrix.skills, '']);
  };
  
  const removeSkill = (index: number) => {
    const updatedSkills = editedMatrix.skills.filter((_, i) => i !== index);
    handleChange('skills', updatedSkills);
  };
  
  const handleProjectChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...editedMatrix.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    handleChange('projects', updatedProjects);
  };
  
  const addProject = () => {
    handleChange('projects', [...editedMatrix.projects, { name: '', description: '', url: '' }]);
  };
  
  const removeProject = (index: number) => {
    const updatedProjects = editedMatrix.projects.filter((_, i) => i !== index);
    handleChange('projects', updatedProjects);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Position Matrix</CardTitle>
          {editable && !isEditing && (
            <Button variant="outline" onClick={handleEdit}>
              Edit
            </Button>
          )}
          {editable && isEditing && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Archetype Section */}
            <div>
              <h3 className="text-lg font-medium text-accent-primary mb-2">Archetype</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <select
                    value={editedMatrix.archetype}
                    onChange={(e) => handleChange('archetype', e.target.value)}
                    className="w-full px-4 py-2 bg-background-secondary border border-background-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                  >
                    <option value="BUILDER">Builder</option>
                    <option value="VISIONARY">Visionary</option>
                    <option value="SPECIALIST">Specialist</option>
                    <option value="CONNECTOR">Connector</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              ) : (
                <p className="text-text-primary">
                  {positionMatrix.archetype === 'BUILDER' ? 'Builder' :
                   positionMatrix.archetype === 'VISIONARY' ? 'Visionary' :
                   positionMatrix.archetype === 'SPECIALIST' ? 'Specialist' :
                   positionMatrix.archetype === 'CONNECTOR' ? 'Connector' : 'Other'}
                </p>
              )}
            </div>
            
            {/* Skills Section */}
            <div>
              <h3 className="text-lg font-medium text-accent-primary mb-2">Core Skills</h3>
              {isEditing ? (
                <div className="space-y-2">
                  {editedMatrix.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        fullWidth
                      />
                      <Button
                        variant="ghost"
                        onClick={() => removeSkill(index)}
                        className="text-accent-error"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addSkill} className="mt-2">
                    Add Skill
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {positionMatrix.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-background-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Projects Section */}
            <div>
              <h3 className="text-lg font-medium text-accent-primary mb-2">Active Projects</h3>
              {isEditing ? (
                <div className="space-y-4">
                  {editedMatrix.projects.map((project, index) => (
                    <div key={index} className="space-y-2 p-4 border border-background-primary rounded-md">
                      <Input
                        label="Project Name"
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                        fullWidth
                      />
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Description
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-2 bg-background-secondary border border-background-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                          rows={3}
                        />
                      </div>
                      <Input
                        label="URL (optional)"
                        value={project.url || ''}
                        onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                        fullWidth
                      />
                      <Button
                        variant="ghost"
                        onClick={() => removeProject(index)}
                        className="text-accent-error mt-2"
                      >
                        Remove Project
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addProject}>
                    Add Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {positionMatrix.projects.map((project, index) => (
                    <div key={index} className="p-4 bg-background-primary rounded-md">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-text-secondary mt-1">{project.description}</p>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-primary text-sm mt-2 inline-block"
                        >
                          Project Link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Collaboration Goals Section */}
            <div>
              <h3 className="text-lg font-medium text-accent-primary mb-2">Collaboration Goals</h3>
              {isEditing ? (
                <textarea
                  value={editedMatrix.goals}
                  onChange={(e) => handleChange('goals', e.target.value)}
                  className="w-full px-4 py-2 bg-background-secondary border border-background-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                  rows={4}
                />
              ) : (
                <p className="text-text-primary">{positionMatrix.goals}</p>
              )}
            </div>
            
            {/* Ideal Collaborator Section */}
            <div>
              <h3 className="text-lg font-medium text-accent-primary mb-2">Ideal Collaborator</h3>
              {isEditing ? (
                <textarea
                  value={editedMatrix.idealCollaborator}
                  onChange={(e) => handleChange('idealCollaborator', e.target.value)}
                  className="w-full px-4 py-2 bg-background-secondary border border-background-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                  rows={4}
                />
              ) : (
                <p className="text-text-primary">{positionMatrix.idealCollaborator}</p>
              )}
            </div>
            
            {/* Notes Section */}
            <div>
              <h3 className="text-lg font-medium text-accent-primary mb-2">Additional Notes</h3>
              {isEditing ? (
                <textarea
                  value={editedMatrix.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full px-4 py-2 bg-background-secondary border border-background-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                  rows={4}
                />
              ) : (
                <p className="text-text-primary">{positionMatrix.notes}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
