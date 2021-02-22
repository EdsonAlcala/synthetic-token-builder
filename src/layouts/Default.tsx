import React from "react"
import { Row, Container, Col } from "react-bootstrap"

export const DefaultLayout: React.FC = ({ children }) => {
  return (
    <Container fluid={true}>
      <Row className="full-height">
        <Col>
          {children}
        </Col>
      </Row>
    </Container>
  )
}
