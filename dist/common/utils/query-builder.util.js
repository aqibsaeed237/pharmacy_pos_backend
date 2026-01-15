"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderUtil = void 0;
class QueryBuilderUtil {
    static applySearch(queryBuilder, searchTerm, searchFields) {
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
    static applyDateRange(queryBuilder, dateField, startDate, endDate) {
        if (startDate) {
            queryBuilder.andWhere(`${dateField} >= :startDate`, { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere(`${dateField} <= :endDate`, { endDate });
        }
        return queryBuilder;
    }
    static applyTenantFilter(queryBuilder, tenantId, tenantField = 'tenantId') {
        return queryBuilder.andWhere(`${tenantField} = :tenantId`, { tenantId });
    }
}
exports.QueryBuilderUtil = QueryBuilderUtil;
//# sourceMappingURL=query-builder.util.js.map