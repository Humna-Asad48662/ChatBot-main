import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import EditorComponent from './editor.component';
import { QueryLLMService } from '../../services/queryLLM.service';
import { QueryHistoryService } from '../../services/queryHistory.service';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let queryLLMService: jasmine.SpyObj<QueryLLMService>;
  let queryHistoryService: jasmine.SpyObj<QueryHistoryService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const queryLLMServiceSpy = jasmine.createSpyObj('QueryLLMService', ['query']);
    const queryHistoryServiceSpy = jasmine.createSpyObj('QueryHistoryService', ['getAll', 'add', 'getById', 'delete']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { paramMap: { get: () => '1' } } });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditorComponent],
      providers: [
        { provide: QueryLLMService, useValue: queryLLMServiceSpy },
        { provide: QueryHistoryService, useValue: queryHistoryServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    queryLLMService = TestBed.inject(QueryLLMService) as jasmine.SpyObj<QueryLLMService>;
    queryHistoryService = TestBed.inject(QueryHistoryService) as jasmine.SpyObj<QueryHistoryService>;

    // Mock the getAll method to return an observable
    queryHistoryService.getAll.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form and save query history', () => {
    const query = 'test query';
    const response = 'test response';

    queryLLMService.query.and.returnValue(of({ choices: [{ message: { content: response } }] }));
    queryHistoryService.add.and.returnValue(of(true));

    component.articleForm.setValue({ body: query, response: '' });
    component.submitForm();

    expect(component.isSubmitting).toBeFalse();
    expect(component.articleForm.value.response).toBe(response);
    expect(queryHistoryService.add).toHaveBeenCalledWith(jasmine.objectContaining({ query, answer: response }));
  });
});