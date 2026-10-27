import React from 'react'

interface ToggleTablaProps {
    tabla: React.ReactNode
    showTable: boolean
    children?: React.ReactNode
}

export const ToggleTabla = ({ tabla, showTable, children }: ToggleTablaProps) => {
    if (showTable) {
        return (
            <div>
                {tabla}
            </div>
        )
    }
    return (
        <div>
            {children}
        </div>
    )
}


