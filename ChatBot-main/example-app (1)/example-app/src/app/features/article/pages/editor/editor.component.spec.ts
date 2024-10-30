import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import EditorComponent from './editor.component';
import { QueryLLMService } from '../../services/queryLLM.service';
import { QueryHistoryService } from '../../services/queryHistory.service';
import { QueryHistory } from '../../models/queryHistory.model';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let queryLLMService: jasmine.SpyObj<QueryLLMService>;
  let queryHistoryService: jasmine.SpyObj<QueryHistoryService>;

  beforeEach(async () => {
    const queryLLMServiceSpy = jasmine.createSpyObj('QueryLLMService', ['query']);
    const queryHistoryServiceSpy = jasmine.createSpyObj('QueryHistoryService', ['getAll', 'add', 'delete']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditorComponent],
      providers: [
        { provide: QueryLLMService, useValue: queryLLMServiceSpy },
        { provide: QueryHistoryService, useValue: queryHistoryServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    queryLLMService = TestBed.inject(QueryLLMService) as jasmine.SpyObj<QueryLLMService>;
    queryHistoryService = TestBed.inject(QueryHistoryService) as jasmine.SpyObj<QueryHistoryService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load chat history on init', () => {
    const mockHistory: QueryHistory[] = [
      { id: 1, query: 'Test query 1', answer: 'Test answer 1', isActive: true, createdDate: new Date() },
      { id: 2, query: 'Test query 2', answer: 'Test answer 2', isActive: true, createdDate: new Date() }
    ];
    queryHistoryService.getAll.and.returnValue(of(mockHistory));

    component.ngOnInit();

    expect(component.chatHistory).toEqual(mockHistory);
  });

  it('should submit form and save query history', () => {
    const mockResponse = { choices: [{ message: { content: 'Test response' } }] };
    queryLLMService.query.and.returnValue(of(mockResponse));
    queryHistoryService.add.and.returnValue(of(true));

    component.articleForm.setValue({ body: 'Test query', response: '' });
    component.submitForm();

    expect(queryLLMService.query).toHaveBeenCalledWith('Test query');
    expect(component.articleForm.value.response).toBe('Test response');
    expect(queryHistoryService.add).toHaveBeenCalled();
  });

  it('should clear text areas', () => {
    component.articleForm.setValue({ body: 'Test query', response: 'Test response' });
    component.clearTextAreas();

    expect(component.articleForm.value.body).toBe('');
    expect(component.articleForm.value.response).toBe('');
  });

  it('should delete chat history', () => {
    const mockHistory: QueryHistory[] = [
      { id: 1, query: 'Test query 1', answer: 'Test answer 1', isActive: true, createdDate: new Date() }
    ];
    queryHistoryService.getAll.and.returnValue(of(mockHistory));
    queryHistoryService.delete.and.returnValue(of(true));

    component.ngOnInit();
    component.deleteChatHistory(1);

    expect(queryHistoryService.delete).toHaveBeenCalledWith(1);
    expect(queryHistoryService.getAll).toHaveBeenCalledTimes(2); // Once on init and once after delete
  });

  it('should clear text areas after getting response from LLM and populating chat history', () => {
    const mockResponse = { choices: [{ message: { content: 'Test response' } }] };
    queryLLMService.query.and.returnValue(of(mockResponse));
    queryHistoryService.add.and.returnValue(of(true));

    component.articleForm.setValue({ body: 'Test query', response: '' });
    component.submitForm();

    expect(queryLLMService.query).toHaveBeenCalledWith('Test query');
    expect(component.articleForm.value.response).toBe('Test response');
    expect(queryHistoryService.add).toHaveBeenCalled();

    component.clearTextAreas();

    expect(component.articleForm.value.body).toBe('');
    expect(component.articleForm.value.response).toBe('');
  });
});