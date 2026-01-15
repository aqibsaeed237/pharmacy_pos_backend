import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
export declare class QueryBuilderUtil {
    static applySearch<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, searchTerm: string, searchFields: string[]): SelectQueryBuilder<T>;
    static applyDateRange<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, dateField: string, startDate?: Date, endDate?: Date): SelectQueryBuilder<T>;
    static applyTenantFilter<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, tenantId: string, tenantField?: string): SelectQueryBuilder<T>;
}
