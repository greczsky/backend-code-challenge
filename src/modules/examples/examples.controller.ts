import { Controller, Get, Param, HttpCode, Post, Body, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiCustomBadRequestResponse,
  ApiCustomInternalServerErrorResponse,
  ApiCustomNotFoundResponse,
} from 'commons-nestjs';
import { successResponseNestjs } from 'http-response';

import { CreateExampleRequestDto } from './dto/request/create-example/create-example-request.dto';
import { GetAllExamplesRequestDto } from './dto/request/get-all-examples/get-all-examples-request.dto';
import { GetExampleRequestDto } from './dto/request/get-example/get-example-request.dto';
import { ExampleResponseDto } from './dto/response/common/example-response.dto';
import { GetAllExamplesResponseDto } from './dto/response/get-all-examples/get-all-examples-response.dto';
import { ExamplesService } from './services/examples/examples.service';

@ApiTags('examples')
@ApiSecurity('bearerAuth')
@ApiHeader({
  name: 'X-Correlation-Id',
  description: 'Correlation ID',
  schema: {
    example: 'c799556d-dc64-4d0b-a91f-9ac1d21a4874',
  },
})
@Controller('examples')
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  @Post()
  @ApiOperation({
    operationId: 'createExample',
    description: 'Create example.',
    summary: 'Create example',
  })
  @ApiCreatedResponse({
    description: 'Created example',
    type: ExampleResponseDto,
  })
  @ApiCustomBadRequestResponse()
  @ApiCustomInternalServerErrorResponse()
  async createExample(
    @Body() createExamplePostRequestDto: CreateExampleRequestDto,
  ): Promise<ExampleResponseDto> {
    const example = await this.examplesService.create(createExamplePostRequestDto);
    // Transform response if needed
    return successResponseNestjs(example);
  }

  @Get('/')
  @ApiOperation({
    operationId: 'getAllExamples',
    description: `Retrieve a collection of the paginated examples.`,
    summary: 'Get all examples',
  })
  @ApiOkResponse({
    description: 'Retrieve a collection of the examples.',
    type: GetAllExamplesResponseDto,
  })
  @ApiCustomBadRequestResponse()
  @ApiCustomInternalServerErrorResponse()
  @HttpCode(200)
  async getAllExamples(
    @Query() getAllExamplesGetRequestDto: GetAllExamplesRequestDto,
  ): Promise<GetAllExamplesResponseDto> {
    const result = await this.examplesService.getAll(getAllExamplesGetRequestDto);

    const responseBody = {
      resultSetDescriptor: result.pagination,
      resultSet: result.examples,
    };

    return successResponseNestjs(responseBody);
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getExample',
    description: 'Get example by uid.',
    summary: 'Get example',
  })
  @ApiOkResponse({
    description: 'Retrieved example.',
    type: ExampleResponseDto,
  })
  @ApiCustomBadRequestResponse()
  @ApiCustomNotFoundResponse()
  @ApiCustomInternalServerErrorResponse()
  async getExample(@Param() params: GetExampleRequestDto): Promise<ExampleResponseDto> {
    const { id } = params;
    const example = await this.examplesService.get(id);
    return successResponseNestjs(example);
  }
}
