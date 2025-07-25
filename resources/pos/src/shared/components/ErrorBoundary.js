import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error en componente:", error, errorInfo);
        // Puedes enviar el error a un servicio de reporte de errores aquí
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="alert alert-danger">
                    <h4>Algo salió mal</h4>
                    <p>Por favor recarga la página o intenta nuevamente más tarde.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
