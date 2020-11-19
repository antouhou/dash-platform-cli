const Identifier = require('@dashevo/dpp/lib/Identifier');

/**
 * Convert where condition identifier properties
 *
 * @param {WhereCondition} whereCondition
 * @param {Object} binaryProperties
 * @param {null|string} [parentProperty=null]
 *
 * @return {WhereCondition}
 */
function convertIdentifierProperties(whereCondition, binaryProperties, parentProperty = null) {
  const [propertyName, operator, propertyValue] = whereCondition;

  const fullPropertyName = parentProperty ? `${parentProperty}.${propertyName}` : propertyName;

  if (operator === 'elementMatch') {
    return [
      propertyName,
      operator,
      convertIdentifierProperties(
        propertyValue,
        binaryProperties,
        fullPropertyName
      )
    ];
  }

  let convertedPropertyValue = propertyValue;

  const property = binaryProperties[fullPropertyName];

  const isPropertyIdentifier = property && property.contentMediaType === Identifier.MEDIA_TYPE;
  const isSystemIdentifier = ['$id', '$ownerId'].includes(propertyName);

  if (isSystemIdentifier || (isPropertyIdentifier && typeof propertyValue === 'string')) {
    // Temp fix before it gets fixed by the SDK
    if (isSystemIdentifier && Array.isArray(propertyValue)) {
      convertedPropertyValue = propertyValue.map(value => {
        if (typeof value === 'string') {
          return Identifier.from(value, 'base64');
        }
        return Identifier.from(value);
      });
    } else if (typeof propertyValue === 'string') {
      // Temp fix for Quantum's serialized queries
      convertedPropertyValue = Identifier.from(propertyValue, 'base64');
    } else {
      convertedPropertyValue = Identifier.from(propertyValue);
    }
  }

  return [propertyName, operator, convertedPropertyValue];
}

class DocumentController {
  constructor(dashClient) {
    this.dash = dashClient;
  }

  async get(contractId, documentType, queryString) {
    const query = JSON.parse(queryString);
    const contract = await this.dash.platform.contracts.get(Identifier.from(contractId));

    const binaryProperties = contract.getBinaryProperties(documentType);

    const where = query.map(
      (whereCondition) => convertIdentifierProperties(whereCondition, binaryProperties)
    );

    const rawDocuments = await this.dash.getDAPIClient().platform.getDocuments(
      Identifier.from(contractId),
      documentType,
      {
        where
      }
    );

    const { dpp } = this.dash.platform;

    const documents = await Promise.all(rawDocuments.map((rawDocument) => {
      return dpp.document.createFromBuffer(rawDocument);
    }));

    console.dir(documents.map(document => document.toJSON()), { depth: 100 });
  }
}

module.exports = DocumentController;
