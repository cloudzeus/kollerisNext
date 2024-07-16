import React from 'react';

export default function UserRoleChip(data ) {
    const contentTemplate = () => {
        switch (data) {
            case 'admin':
                return (
                    <div className="styled-chip">
                        <span className="first" style={{ backgroundColor: '#6366F1' }}>A</span>
                        <span className="second">Admin</span>
                    </div>
                )
            case 'employee':
                return (
                    <div className="styled-chip">
                        <span className="first" style={{ backgroundColor: '#38c74c' }}>E</span>
                        <span className="second">Employee</span>
                    </div>
                )
            case 'manager':
                return (
                    <div className="styled-chip">
                        <span className="first" style={{ backgroundColor: '#48aab7' }}>M</span>
                        <span className="second">Manager</span>
                    </div>
                )
            case 'user':
                return (
                    <div className="styled-chip">
                        <span className="first" style={{ backgroundColor: '#e89917' }}>U</span>
                        <span className="second">User</span>
                    </div>
                )
            default:
                return null;
        }
    }

    return (
        <div>
            {contentTemplate()}
        </div>
    );
}
