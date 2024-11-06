import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import EditorComponent from './editor.component';
import { QueryLLMService } from '../../services/queryLLM.service';
import { FormBuilder } from '@angular/forms';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let queryLLMService: jasmine.SpyObj<QueryLLMService>;

  beforeEach(async () => {
    const queryLLMServiceSpy = jasmine.createSpyObj('QueryLLMService', ['query']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, EditorComponent],
      providers: [
        { provide: QueryLLMService, useValue: queryLLMServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    queryLLMService = TestBed.inject(QueryLLMService) as jasmine.SpyObj<QueryLLMService>;
    fixture.detectChanges();
  });

  it('should set isSubmitting to true when submitForm is called', () => {
    queryLLMService.query.and.returnValue(of({ choices: [{ message: { content: 'response text' } }] }));
    component.submitForm();
    expect(component.isSubmitting).toBeTrue();
  });

  it('should call articleService.query with the correct query', () => {
    queryLLMService.query.and.returnValue(of({ choices: [{ message: { content: 'response text' } }] }));
    component.articleForm.patchValue({ body: 'test query' });
    component.submitForm();
    expect(queryLLMService.query).toHaveBeenCalledWith('test query');
  });

  it('should update the form with the response text', () => {
    const mockResponse = { choices: [{ message: { content: 'response text' } }] };
    queryLLMService.query.and.returnValue(of(mockResponse));

    component.articleForm.patchValue({ body: 'test query' });
    component.submitForm();

    expect(component.articleForm.get('response')?.value).toBe('response text');
  });

  it('should call focusTextarea', () => {
    spyOn(component, 'focusTextarea');
    const mockResponse = { choices: [{ message: { content: 'response text' } }] };
    queryLLMService.query.and.returnValue(of(mockResponse));

    component.articleForm.patchValue({ body: 'test query' });
    component.submitForm();

    expect(component.focusTextarea).toHaveBeenCalled();
  });

  it('should set isSubmitting to false after the response is received', () => {
    const mockResponse = { choices: [{ message: { content: 'response text' } }] };
    queryLLMService.query.and.returnValue(of(mockResponse));

    component.articleForm.patchValue({ body: 'test query' });
    component.submitForm();

    expect(component.isSubmitting).toBeFalse();
  });
});