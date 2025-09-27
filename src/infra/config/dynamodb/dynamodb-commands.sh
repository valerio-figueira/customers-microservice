aws dynamodb create-table \
  --table-name CustomersTable \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --endpoint-url=http://localhost:4566 \
  --billing-mode PAY_PER_REQUEST
