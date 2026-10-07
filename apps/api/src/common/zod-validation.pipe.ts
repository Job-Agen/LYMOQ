import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodType, ZodTypeDef } from 'zod';

/**
 * Validates a request body/query with a schema from @mesura/shared.
 * The same schemas power the mobile forms, so both sides agree on the contract,
 * but the backend never trusts that the client already validated.
 */
export class ZodValidationPipe<TOutput> implements PipeTransform<unknown, TOutput> {
  constructor(private readonly schema: ZodType<TOutput, ZodTypeDef, unknown>) {}

  transform(value: unknown): TOutput {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: result.error.issues[0]?.message ?? 'Invalid request',
        issues: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    return result.data;
  }
}
