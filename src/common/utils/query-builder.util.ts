import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export class QueryBuilderUtil {
  static applySearch<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    searchTerm: string,
    searchFields: string[],
  ): SelectQueryBuilder<T> {
    if (!searchTerm || !searchFields.length) {
      return queryBuilder;
    }

    const conditions = searchFields
      .map((field, index) => {
        const paramName = `search${index}`;
        return `${field} LIKE :${paramName}`;
      })
      .join(' OR ');

    return queryBuilder.andWhere(`(${conditions})`, {
      ...searchFields.reduce((acc, field, index) => {
        acc[`search${index}`] = `%${searchTerm}%`;
        return acc;
      }, {}),
    });
  }

  static applyDateRange<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    dateField: string,
    startDate?: Date,
    endDate?: Date,
  ): SelectQueryBuilder<T> {
    if (startDate) {
      queryBuilder.andWhere(`${dateField} >= :startDate`, { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere(`${dateField} <= :endDate`, { endDate });
    }
    return queryBuilder;
  }

  static applyTenantFilter<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    tenantId: string,
    tenantField: string = 'tenantId',
  ): SelectQueryBuilder<T> {
    return queryBuilder.andWhere(`${tenantField} = :tenantId`, { tenantId });
  }
}
